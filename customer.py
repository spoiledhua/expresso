from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
import pytz, base64
import datetime as d
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
    'items': ['S Chai Latte', 'Hot Coffee']
}
# initialize CAS
#cas = CAS()
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
#@jwt_required
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
#@jwt_required
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
# GET request that returns the latest order placed
@customer.route('/customer/orderid', methods=['GET'])
@jwt_required
def order_id():
    if request.method == 'GET':
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        return jsonify(history_schema.dump(query)), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/placeorder', methods = ['POST'])
#@jwt_required
def place_order():
    ordered = []
    if request.method == 'POST':
        try:
            incoming = request.get_json()
            print(incoming)
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400

        currenttime = d.datetime.now()
        timezone = pytz.timezone("America/New_York")
        d_aware = timezone.localize(currenttime)
        order = History(
            netid = incoming['netid'],
            time = d_aware,
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
                item_detail = i['sp'][0] + ' ' + i['item']['name'] + ' w/ ' + addon_list
            else:
                item_detail = i['item']['name'] + ' w/ ' + addon_list
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
@customer.route('/customer/orderinfo', methods = ['GET'])
#@jwt_required
def get_information():
    history = []
    if request.method == 'GET':
        try:
            user = 'vhua'
            order = db.session.query(History).filter_by(netid=user).\
            order_by(History.orderid.desc()).limit(1).all()
            for item in order:
                item = history_schema.dump(item)
                history.append(item)
            return jsonify(history), 200
        except Exception as e:
            return jsonify(error=True), 400
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/<netid>/orderhistory', methods = ['GET'])
#@jwt_required
def get_history(netid):
    past_orders = []
    if request.method == 'GET':
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
