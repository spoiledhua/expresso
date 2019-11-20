from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
import datetime
from models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

#-------------------------------------------------------------------------------
# Sets up the barista routes
barista = Blueprint('barista', 'barista')
CORS(barista)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/authenticate', methods=['POST'])
#@jwt.authenticate
def barista_authenticate():
    if request.method != 'POST':
        return jsonify(error=True), 405

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    __password = 'WeLoveCoffee123'
    if not username:
        return jsonify(username=None), 400
    if not password:
        return jsonify(username=None), 400
    password = generate_password_hash(password)
    if username == 'coffeeclub_barista' or check_password_hash(password, __password):
        # Identity can be any data that is json serializable
        return jsonify(username=username), 200
    else:
        return jsonify(username=None), 401

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
# with the oldest request first
@barista.route('/barista/getorders', methods=['GET'])
#@jwt_required
def get_orders():
    orders = []
    if request.method == 'GET':
        query = db.session.query(History).filter(History.order_status!=2).order_by(History.time.asc()).all()
        for items in query:
            orders.append(history_schema.dump(items))
        return jsonify(orders), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@barista.route('/barista/<id>/complete', methods=['POST'])
#@jwt_required
def complete_order(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.payment is True:
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
@barista.route('/barista/<id>/paid', methods=['POST'])
#@jwt_required
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
@barista.route('/barista/<orderid>/inprogress', methods=['POST'])
#@jwt_required
def in_progress(orderid):
    if request.method == 'POST':
        query = db.session.query(History).get(orderid)
        if query.order_status is 0:
            print('here')
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
@barista.route('/barista/<item_name>/changestock', methods=['POST'])
#@jwt_required
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
@barista.route('/barista/loadinventory', methods = ['GET'])
#@jwt_required
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
# GET HTTP Request that gets orders from History and returns orders
@barista.route('/barista/getallhistory', methods=['GET'])
#@jwt_required
def get_allhistory():
    history = []
    if request.method == 'GET':
        """incoming = request.get_json()['netid']
        if __isauthenticated(incoming) is False:
            return jsonify(error=True), 401"""
        query = db.session.query(History).all()
        for item in query:
            item = history_schema.dump(item)
            history.append(item)
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET HTTP Request that gets orders from History and returns orders
@barista.route('/barista/getdayhistory', methods=['GET'])
#@jwt_required
def get_dayhistory():
    history = []
    yesterday = datetime.date.fromordinal(datetime.date.today().toordinal()-1)
    if request.method == 'GET':
        """incoming = request.get_json()['netid']
        if __isauthenticated(incoming) is False:
            return jsonify(error=True), 401"""
        query = db.session.query(History).filter(History.time > yesterday).all()
        for item in query:
            item = history_schema.dump(item)
            history.append(item)
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405
