# -----------------------------------------------------------------------
# customer.py
# Author: Expresso server-side developers
# -----------------------------------------------------------------------
from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, session, Response, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from models import db, ma, Menu, History, Images, Barista, Status, Details, MenuSchema, HistorySchema, DetailsSchema
import os, pytz, base64, datetime, hashlib, re
import urllib.parse
from ldap import LDAP
from CASClient import CASClient
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from sendmail import confirmation, feedback
#-------------------------------------------------------------------------------
customer = Blueprint('customer', 'customer')
CORS(customer, supports_credentials=True)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# CUSTOMER
#-------------------------------------------------------------------------------
@customer.route('/customer/logout', methods=['GET'])
def logout():
    if request.method == 'GET':
        return jsonify(url=CASClient().logout()), 201
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@customer.route('/customer/getuser', methods=['GET', 'OPTIONS'])
def getuser():
    if request.method == 'GET':
        ret = CASClient().get_user()
        user = None
        if ret[0] is not None:
            user = ret[0]
            user = user[:-1]
        elif ret[1] is not None:
            return jsonify(error=True), 400
        if user is not None:
            access_token = create_access_token(identity=user, expires_delta=False)
        else:
            access_token = ''
        eligible = True
        conn = LDAP()
        conn.connect_LDAP()
        status = conn.get_pustatus(user)
        if status != 'undergraduate':
            eligible=False
        return jsonify(user=user, charge_eligible = eligible, token=access_token), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@customer.route('/customer/authenticate', methods=['GET', 'OPTIONS'])
def authenticate():
    if request.method == 'GET':
        ret = CASClient().authenticate()
        if ret[0] is None and ret[1] is not None:
            return jsonify(user = ret[0], url = ret[1]), 200
        elif ret[0] is not None and ret[1] is not None:
            return jsonify(user = ret[0], url = 'http://coffeeclub.princeton.edu'), 200
        else:
            return redirect('http://localhost:3000/menu')
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
#@jwt_required
def populate_menu():
    items = []
    none = 'no_image'
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""

        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            menu_item = menu_schema.dump(item)
            picture = db.session.query(Images).filter(Images.name==item.item).all()
            if len(picture) == 0:
                picture = db.session.query(Images).filter(Images.name==none).all()
            picture = picture[0].picture
            menu_item['image'] = base64.b64encode(picture).decode('utf-8')
            items.append(menu_item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
#GET Request that returns all of the information about specified item
@customer.route('/customer/menu/<item>', methods=['GET'])
def menu_get(item):
    items = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""
        item_name = item
        query = db.session.query(Menu).filter(Menu.item==item_name).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            if item.availability is False:
                return jsonify(availability=False), 402
        return jsonify(availability=True, items=items), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/<netid>/placeorder', methods = ['POST'])
#@jwt_required
def place_order(netid):
    receipt = {}
    receipt['items']=[]
    if request.method == 'POST':
        eastern = pytz.timezone('US/Eastern')
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        if incoming['time'] == 'Now':
            currenttime = eastern.localize(datetime.datetime.now())
        # for delayed ordering
        else:
            # get the year, month, and day for today to make datetime object
            year = datetime.date.today().year
            month = datetime.date.today().month
            day = datetime.date.today().day
            timestamp = incoming['time'].split(':')
            currenttime = eastern.localize(datetime.datetime(year, month, day, int(timestamp[0]), int(timestamp[1])))

        # check whether the items ordered are in stock
        for i in incoming['items']:
            query = db.session.query(Menu).filter_by(item=i['item']['name']).first()
            if query is None:
                return jsonify(error=True), 408
            if query.availability is False:
                return jsonify(availability=False, item=query.item), 200
            for add in i['addons']:
                addon = add['name']
                query = db.session.query(Menu).filter_by(item=addon).first()
                if query is None:
                    return jsonify(error=True), 408
                if query.availability is False:
                    return jsonify(availability=False, item=query.item), 200
        # add item to the History table
        order = History(
            netid = netid,
            time = currenttime,
            cost = incoming['cost'],
            payment = incoming['payment'],
            status = incoming['status'],
            order_status = 0
        )
        try:
            db.session.add(order)
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 408

        # add the order details to the dictionary receipt for email
        receipt['netid']= netid
        receipt['cost'] = incoming['cost']
        receipt['time'] = currenttime.strftime("%H:%M")
        receipt['type_payment']= incoming['payment']
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        if query is None:
            return jsonify(error=True), 408
        id = query.orderid
        item_id = 0
        # add items to order details table
        for i in incoming['items']:
            addon_list = ''
            count = 0
            for add in i['addons']:
                addon = add['name']
                if count is 0:
                    addon_list += addon
                else:
                    addon_list += ', ' + addon
                count += 1
            if i['sp'] == 'Small' or i['sp'] == 'Large':
                item_detail = i['sp'] + ' ' + i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            else:
                item_detail = i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            object = Details(
                id = id,
                item = item_detail,
                item_id = item_id
            )
            try:
                db.session.add(object)
                db.session.commit()
                # append items to the receipt
                receipt['items'].append(item_detail)
                item_id += 1
            except Exception as e:
                return jsonify(error=True), 408
        confirmation(receipt)
        return jsonify(availability=True, item=None), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns store status
@customer.route('/customer/storestatus', methods=['GET'])
#@jwt_required
def get_storestatus():
    if request.method == 'GET':
        query = db.session.query(Status).all()
        return jsonify(status = query[0].open), 200
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/<netid>/orderhistory', methods = ['GET'])
@jwt_required
def get_history(netid):
    past_orders = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg = "Please login"), 401
        elif session['username'] != netid:
            return jsonify(msg = "Wrong netid"), 401"""

        query = db.session.query(History).filter_by(netid=netid).order_by(History.orderid.desc()).all()
        for orders in query:
            items = db.session.query(Details).filter(Details.id==orders.orderid).all()
            item_names = []
            for item in items:
                item_names.append(item.item)
            barista_row = {}
            barista_row['item'] = item_names
            barista_row['netid'] = orders.netid
            barista_row['time'] = str(orders.time) + ' EST'
            barista_row['orderid'] = orders.orderid
            barista_row['status'] = orders.status
            barista_row['cost'] = orders.cost
            barista_row['payment'] = orders.payment
            past_orders.append(barista_row)
        return jsonify(past_orders), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@customer.route('/customer/<netid>/displayname', methods=['GET'])
@jwt_required
def get_display(netid):
    if request.method == 'GET':
        conn = LDAP()
        conn.connect_LDAP()
        displayname = conn.get_displayname(netid)
        if displayname == '':
            displayname = conn.get_givenname(netid)
            if displayname is '':
                displayname = netid
        return jsonify(name=displayname), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@customer.route('/customer/contact', methods=['POST'])
#@jwt_required
def contact():
    if request.method == 'POST':
        attach = {}
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        first = incoming['firstname']
        attach['firstname'] = first
        last = incoming['lastname']
        attach['lastname'] = last
        email = incoming['email']
        attach['netid'] = email
        # regex email checker comes from Geek for Geeks
        regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
        search = re.search(regex,email)
        if (search is None):
            return jsonify(error='Invalid email'), 200
        message = incoming['message']
        attach['comment'] = message
        feedback(attach)
        return jsonify(error=None), 200
    else:
        return jsonify(error=True), 405
