from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
import os, pytz, base64
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
    'netid': 'dorothyz',
    'orderid': 11,
    'cost': 8.50,
    'payment': True,
    'status': False,
    'items': ['S Chai Latte', 'Hot Coffee']
}
# initialize CAS
#cas = CAS()
#-------------------------------------------------------------------------------
@customer.route('/', defaults={'path':''}, methods=['GET'])
@customer.route('/<path:path>')
#@login_required
def index(path):
    return render_template('index.html')
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
#@jwt_required
def populate_menu():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).filter(Menu.category != 'Add').all()
        for item in query:
            menu_item = menu_schema.dump(item)
            #print(db.session.query(Images).all())
            picture = db.session.query(Images).filter(Images.name==item.item).all()[0].picture
            menu_item['image'] = base64.b64encode(picture).decode('utf-8')
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
    print(incoming)
    if request.method == 'POST':
        try:
            print(1)
            #incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400

        for i in incoming['items']:
            object = Details(
                id = incoming['orderid'],
                item = i
            )
            db.session.add(object)

            try:
                db.session.commit()
                ordered.append(object)
            except Exception as e:
                return jsonify(error=True), 408
        currenttime = d.datetime.now()
        timezone = pytz.timezone("America/New_York")
        d_aware = timezone.localize(currenttime)
        order = History(
            netid = incoming['netid'],
            orderid = incoming['orderid'],
            time = d_aware,
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
            #user = CASClient().authenticate()
            user = 'dorothyz'
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
@jwt_required
def get_history():
    history = []
    if request.method == 'GET':
        try:
            user = CASClient().authenticate()
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
