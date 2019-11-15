from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_caching import Cache
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import datetime as d
from models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

#-------------------------------------------------------------------------------
customer = Blueprint('customer', 'customer')
CORS(customer)
cache = Cache(config={'CACHE_TYPE': 'simple'})
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

incoming = {
    'netid': 'dorothyz',
    'orderid': 5,
    'cost': 8.50,
    'payment': 1,
    'status': False,
    'item': 'S Chai Latte',
    'quantity': 2
}
# initialize CAS
#cas = CAS()
#-------------------------------------------------------------------------------
@customer.route('/', methods=['GET'])
#@login_required
def index():
    return render_template('index.html')
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
def populate_menu():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).all()
        for item in query:
            item = menu_schema.dump(item)
            items.append(item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
#GET Request that returns all of the information about specified item
@customer.route('/customer/menu/<item>', methods=['GET'])
#@login_required
def menu_get(item):
    if request.method == 'GET':
        item_name = item
        query = db.session.query(Menu).get(item_name)
        return jsonify(menu_schema.dump(query)), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@customer.route('/customer/additem', methods=['POST'])
#@login_required
def add_item():
    if request.method == 'POST':
        item_name = incoming['item']
        item_list = cache.get(items)
        if item_list is None:
            item_list = []
        item_list.append(item_name)
        cache.set('items', item_list)
        #incoming = request.get_json()
        ordered_item = Details(
            id = incoming['orderid'],
            quantity = incoming['quantity'],
            item = incoming['item']
        )

        ordered_item= details_schema.dump(ordered_item)
        cache.add(item_name, ordered_item)
        return jsonify(ordered_item), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@customer.route('/customer/deleteitem', methods=['DELETE'])
#@login_required
def delete_item():
    if request.method == 'DELETE':
        item_name = incoming['item']
        item_list = cache.get(items)
        item_list.delete(item_name)
        cache.set('items', item_list)
        #incoming = request.get_json()
        ordered_item = Details(
            id = incoming['orderid'],
            quantity = incoming['quantity'],
            item = incoming['item']
        )

        ordered_item= details_schema.dump(ordered_item)
        try:
            cache.delete(item_name)
        except Exception as e:
            return jsonify(error=True), 403
        return jsonify(ordered_item), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET request that returns the latest order placed
@customer.route('/customer/orderid', methods=['GET'])
def order_id():
    if request.method == 'GET':
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        return jsonify(history_schema.dump(query)), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/placeorder', methods = ['POST'])
#@login_required
def place_order():
    ordered = []
    if request.method == 'POST':
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400

        for object in incoming['items']:
            ordered_item = cache.get(object)
            db.session.add(ordered_item)

            try:
                db.session.commit()
                ordered.append(ordered_item)
            except Exception as e:
                return jsonify(error=True), 408

        order = History(
            netid = incoming['netid'],
            orderid = incoming['orderid'],
            time = d.datetime.utcnow(),
            cost = incoming['cost'],
            payment = incoming['payment'],
            status = incoming['status'],
            order_status = 0
        )

        db.session.add(order)
        try:
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 408
        response = jsonify(menu_schema.dump(ordered))
        response.headers.add('Access-Control-Allow-Origin', '*')
        try:
            cache.clear()
        except Exception as e:
            return jsonify(error=True), 403
        return response, 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/orderinfo', methods = ['GET'])
#@login_required
def get_information():
    history = []
    if request.method == 'GET':
        try:
            user = request.get_json()['netid']
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
@customer.route('/customer/orderhistory', methods = ['GET'])
#@login_required
def get_history():
    history = []
    if request.method == 'GET':
        try:
            user = request.get_json()['netid']
        except Exception as e:
            return jsonify(error=True), 400
        #user = 'victorhua'
        try:
            order = db.session.query(History).filter_by(netid=user).\
            order_by(History.orderid.desc()).all()
            for item in order:
                item = history_schema.dump(item)
                history.append(item)
            return jsonify(history), 200
        except Exception as e:
            return jsonify(error=True), 408
    else:
        return jsonify(error=True), 405
