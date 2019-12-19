from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint, session
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
import pytz, base64
import datetime as d
from LDAP import LDAP
from models import db, Menu, History, Images, Details, MenuSchema, HistorySchema, DetailsSchema
#-------------------------------------------------------------------------------
customer = Blueprint('customer', 'customer')
CORS(customer)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

incoming = {
    'netid': 'vhua',
    'orderid': 11,
    'cost': 8.50,
    'payment': True,
    'status': False,
    'items': [
        {  'item': {
                'name': 'Coffee'
            },
            'addons': [
                {
                'name': ''
                }],
            'sp': 'Small'
        }]
    }

#-------------------------------------------------------------------------------
# CUSTOMER
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
def populate_menu():
    items = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""

        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            menu_item = menu_schema.dump(item)
            picture = db.session.query(Images).filter(Images.name==item.item).all()
            if len(picture) != 0:
                picture = picture[0].picture
                menu_item['image'] = base64.b64encode(picture).decode('utf-8')
                items.append(menu_item)
            else:
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
@customer.route('/customer/checkavailability', methods = ['GET'])
def check_availability():
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg = "Cannot access endpoint"), 401"""
        for i in incoming['items']:
            for add in i['addons']:
                print(add['name'])
                query = db.session.query(Menu).filter_by(item=add['name']).first()
                if query is not None and query.availability is False:
                    return jsonify(item=query.item), 400
            item_name = i['item']['name']
            query = db.session.query(Menu).filter_by(item=item_name).first()
            if query is not None and query.availability is False:
                return jsonify(item=query.item), 400
    return jsonify(item=None), 200

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/<netid>/placeorder', methods = ['POST'])
def place_order(netid):
    if request.method == 'POST':
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        if 'time' not in incoming:
            eastern = pytz.timezone('US/Eastern')
            currenttime = eastern.localize(datetime.datetime.now())
        else:
            currenttime = incoming['time']
        for i in incoming['items']:
            query = db.session.query(Menu).filter_by(item=i['item']['name']).first()
            if query.availability is False:
                return jsonify(availability=False), 200
            for add in i['addons']:
                addon = add['name']
                query = db.session.query(Menu).filter_by(item=addon).first()
                if query.availability is False:
                    return jsonify(availability=False), 200
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
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        id = query.orderid
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
                item = item_detail
            )
            try:
                db.session.add(object)
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        return jsonify(availability=True), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/<netid>/orderhistory', methods = ['GET'])
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
            barista_row['time'] = orders.time
            barista_row['orderid'] = orders.orderid
            barista_row['status'] = orders.status
            barista_row['cost'] = orders.cost
            barista_row['payment'] = orders.payment
            #print(barista_row)
            past_orders.append(barista_row)
        return jsonify(past_orders), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# GET Request that returns status of the individual
@customer.route('/customer/<netid>/checkstatus', methods = ['GET'])
def check_year(netid):
    """if 'username' not in session:
        return jsonify(msg = "Please login"), 401
    elif session['username'] != netid:
        return jsonify(msg = "Wrong netid"), 401"""
    last_valid_date_seniors = ("2019", "04", "07")
    last_valid_year = int(last_valid_date_seniors[0])
    last_valid_month = int(last_valid_date_seniors[1])
    last_valid_day = int(last_valid_date_seniors[2])

    today = d.date.today()
    year = int(today.strftime("%Y"))
    month = int(today.strftime("%m"))
    day = int(today.strftime("%d"))

    senior = 2020

    netid = netid + '\n'
    past_orders = []
    if request.method == 'GET':
        if 'username' not in session:
            return jsonify(msg = "Please login"), 401
        elif session['username'] != netid:
            return jsonify(msg = "Wrong netid"), 401
        conn = LDAP()
        conn.connect_LDAP()
        status = conn.get_pustatus(netid)
        if status == None or status != 'undergraduate':
            return jsonify(error = "Cannot Student Charge"), 405
        classyear = conn.get_puclassyear(netid)
        conn.disconnect_LDAP()
        if classyear == senior:
            if month > last_valid_month and year == last_valid_year:
                return jsonify(error = "Cannot Student Charge"), 405
            if month == last_valid_month and year == last_valid_year and day > last_valid_day:
                return jsonify(error = "Cannot Student Charge"), 405
        else:
            return jsonify(status = status), 200
