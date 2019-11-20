from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from models import db, ma, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema
import os, pytz
import datetime as d

#------------------------------------------------------------------------------
app = Flask(__name__, template_folder = '.')
CORS(app)

# Specifies up the Flask Apps configuration
config = {
    'DEBUG': True,          # some Flask specific configs
    'SQLALCHEMY_DATABASE_URI': 'mysql+mysqlconnector://ccmobile_ccmobile_dora:COS333Account@198.199.71.236/ccmobile_coffee_club',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}

app.secret_key = "coffeelovers4ever"
app.config.from_mapping(config)
db.init_app(app)
ma.init_app(app)
jwt = JWTManager(app)

menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

incoming = {
    'netid': 'dorothyz',
    'orderid': 5,
    'cost': 8.50,
    'payment': 1,
    'status': False,
    'items': ['S Chai Latte'],
    'quantity': [2]
}
#-------------------------------------------------------------------------------
# SET LOGIN TOKEN
#-------------------------------------------------------------------------------
@app.route('/gettoken', methods=['GET'])
def get_token():
    """if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)"""
    __password = 'test'
    """if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400"""
    password = generate_password_hash('test')
    username = 'coffeeclubtester'
    app_pass = generate_password_hash(__password)
    if username == 'coffeeclubtester' or password == app_pass:
        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
#-------------------------------------------------------------------------------
# CUSTOMER
#-------------------------------------------------------------------------------
@app.route('/', methods=['GET'])
@jwt_required
#@login_required
def index():
    return render_template('index.html')
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@app.route('/customer/menu', methods = ['GET'])
@jwt_required
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
@app.route('/customer/menu/<item>', methods=['GET'])
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
@app.route('/customer/orderid', methods=['GET'])
def order_id():
    if request.method == 'GET':
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        return jsonify(history_schema.dump(query)), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@app.route('/customer/placeorder', methods = ['POST'])
@jwt_required
def place_order():
    ordered = []
    if request.method == 'POST':
        try:
            print(1)
            #incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400

        for i in range(len(incoming['items'])):
            object = Details(
                id = incoming['orderid'],
                quantity = incoming['quantity'][i],
                item = incoming['items'][i]
            )
            db.session.add(object)
            try:
                db.session.commit()
                ordered.append(object)
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
        return jsonify(history_schema.dump(order)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns last order
@app.route('/customer/orderinfo', methods = ['GET'])
@jwt_required
def get_information():
    history = []
    if request.method == 'GET':
        try:
            user = 'dorothyz'
            #user = request.get_json()['netid']
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
@app.route('/customer/orderhistory', methods = ['GET'])
@jwt_required
def get_history():
    history = []
    if request.method == 'GET':
        try:
            user = 'dorothyz'
            #user = request.get_json()['netid']
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
#-------------------------------------------------------------------------------
# BARISTA
#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
@app.route('/barista/getorders', methods=['GET'])
@jwt_required
def get_orders():
    orders = []
    if request.method == 'GET':
        query = db.session.query(History).filter(History.order_status!=2).all()
        for items in query:
            orders.append(history_schema.dump(items))
        return jsonify(orders), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@app.route('/barista/<id>/complete', methods=['POST'])
def complete_order(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.payment == 0:
            query.order_status = 2
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(History).get(id)
        return jsonify(history_schema.dump(query)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete once
#the person has paid. Return item.
@app.route('/barista/<id>/paid', methods=['POST'])
@jwt_required
def paid_order(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.payment == 1:
            query.order_status = 2
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(History).get(id)
        return jsonify(history_schema.dump(query)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Changes status of item from not started to in progress. Returns item.
@app.route('/barista/<orderid>/inprogress', methods=['POST'])
@jwt_required
def in_progress(orderid):
    if request.method == 'POST':
        query = db.session.query(History).get(orderid)
        if query.order_status is 0:
            query.order_status = 1
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(History).get(orderid)
        return jsonify(history_schema.dump(query)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Changes stock of item to the opposite of current state and returns item.
@app.route('/barista/<item_name>/changestock', methods=['POST'])
@jwt_required
def change_stock(item_name):
    if request.method == 'POST':
        query = db.session.query(Menu).get(item_name)
        # if the item is not in the Menu, return an error
        if query is None:
            return jsonify(error=True), 405
        # changing the availability of the selected item
        stock_option = query.availability
        print(stock_option)
        if stock_option is False:
            query.availability = True
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
            return jsonify(menu_schema.dump(query)), 201
        elif stock_option is True:
            query.availability = False
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
            return jsonify(menu_schema.dump(query)), 201
        else:
            return jsonify(error=True), 403
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Gets the inventory and returns the inventory.
@app.route('/barista/loadinventory', methods = ['GET'])
@jwt_required
def load_inventory():
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
# GET HTTP Request that gets incomplete orders from History and returns orders
@app.route('/barista/gethistory', methods=['GET'])
@jwt_required
def barista_history():
    history = []
    if request.method == 'GET':
        incoming = request.get_json()['netid']
        """if __isauthenticated(incoming) is False:
            return jsonify(error=True), 401"""
        query = db.session.query(History).limit(20).all()
        for items in query:
            history.append(history_schema.dump(items))
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# ADMIN
#-------------------------------------------------------------------------------
# POST request that will either upload an item and return the item
# needs to do check that the user is called admin
@app.route('/admin/addinventory', methods=['POST'])
@jwt_required
def add_inventory():
    incoming = request.get_json()
    if incoming is None:
        return jsonify(error=True), 403
    if request.method == 'POST':
        new_item = Menu (
            item = incoming['item'],
            price = incoming['price'],
            availability = incoming['availability'],
            category = incoming['category']
        )
        db.session.add(new_item)
        try:
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 408
        return jsonify(menu_schema.dump(new_item))
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# DELETE request that takes item and deletes it from Menu, returns deleted item
@app.route('/admin/deleteinventory', methods=['DELETE'])
@jwt_required
def delete_inventory():
    if request.method == 'DELETE':
        query = db.session.query(Menu).filter_by(item=incoming['item'])
        try:
            deleted = query.one()
            query.delete()
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 403
        return jsonify(menu_schema.dump(deleted))
    else:
        return jsonify(error=True), 405
import models

#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
