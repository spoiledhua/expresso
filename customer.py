from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint, session
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
import pytz, base64
import datetime as d
from ldap import LDAP
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
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
@jwt_required
def populate_menu():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            menu_item = menu_schema.dump(item)
            #print(db.session.query(Images).all())
            #picture = db.session.query(Images).filter(Images.name==item.item).all()[0].picture
            #menu_item['image'] = base64.b64encode(picture).decode('utf-8')
            items.append(menu_item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
#GET Request that returns all of the information about specified item
@customer.route('/customer/menu/<item>', methods=['GET'])
@jwt_required
def menu_get(item):
    items = []
    if request.method == 'GET':
        item_name = item
        query = db.session.query(Menu).filter(Menu.item==item_name).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            items.append(menu_schema.dump(item))
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/<netid>/placeorder', methods = ['POST'])
#@jwt_required
def place_order(netid):
    ordered = []
    if request.method == 'POST':
        """if 'username' not in session:
            return jsonify(msg = "Please login"), 401
        elif session['username'] != netid:
            return jsonify(msg = "Wrong netid"), 401"""

        try:
            print('go')
            #incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        if 'time' not in incoming:
            eastern = pytz.timezone('US/Eastern')
            currenttime = eastern.localize(d.datetime.now())
        else:
            currenttime = incoming['time']
        print(currenttime)
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
        for i in incoming['items']:
            addon_list = ''
            count = 0
            for add in i['addons']:
                if count is 0:
                    addon_list += add['name']
                else:
                    addon_list += ', ' + add['name']
                count += 1
            if i['sp'][0] == 'Small' or i['sp'][0] == 'Large':
                item_detail = i['sp'][0] + ' ' + i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            else:
                item_detail = i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            object = Details(
                id = query.orderid,
                item = item_detail
            )
            try:
                db.session.add(object)
                db.session.commit()
                ordered.append(object)
            except Exception as e:
                return jsonify(error='True'), 408
        return jsonify(history_schema.dump(order)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/<netid>/orderhistory', methods = ['GET'])
@jwt_required
def get_history(netid):
    netid = netid + '\n'
    past_orders = []
    if request.method == 'GET':
        if 'username' not in session:
            return jsonify(msg = "Please login"), 401
        elif session['username'] != netid:
            return jsonify(msg = "Wrong netid"), 401

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
@jwt_required
def check_year(netid):
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
