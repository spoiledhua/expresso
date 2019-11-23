from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint, session
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
@barista.route('/barista/authenticate', methods=['GET'])
#@jwt.authenticate
def barista_authenticate():
    if request.method == 'GET':
        incoming = request.get_json()
        #username = incoming['username']
        #password = incoming['password']
        username = 'dora'
        password = 'dora'
        password = generate_password_hash(password)
        __password = 'dora'

        if 'user' in session:
            return jsonify(user = session.get('username'), url = None)

        else:
            if username == 'dora' and check_password_hash(password, __password):
                print('here')
                session['user'] = 'dora'
                return redirect('http://coffeeclub.princeton.edu')
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/getuser', methods=['GET'])
#@jwt.authenticate
def barista_getuser():
    if request.method == 'GET':
        if 'user' in session:
            return jsonify(user=session.get('user')), 200
        else:
            return jsonify(user=None), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# GET request that returns barista username if in session
@barista.route('/barista/getuser', methods=['GET'])
#@jwt.authenticate
def get_barista_user():
    if request.method != 'GET':
        return jsonify(error=True), 405
    if len(session) == 0:
        return jsonify(username = None), 200
    if session['username'] != None:
        return jsonify(username=session['username']), 200
    else:
        return jsonify(username=None), 200


#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/logout', methods=['GET'])
#@jwt.authenticate
def barista_logout():
    if request.method != 'GET':
        return jsonify(error=True), 405
    try:
        if 'user' in session:
            session.clear()
            return jsonify(user=None), 200
        else:
            return jsonify(error=True), 401
    except Exception as e:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
# with the oldest request first
@barista.route('/barista/getorders', methods=['GET'])
#@jwt_required
def get_orders():
    current_orders = []
    if request.method == 'GET':
        query = db.session.query(History).filter(History.order_status!=2).order_by(History.time.asc()).all()
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
            current_orders.append(barista_row)
        return jsonify(current_orders), 200
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
            query.status = 1
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
        query = db.session.query(History).all()
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
            history.append(barista_row)
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET HTTP Request that gets orders from History and returns orders
@barista.route('/barista/getdayhistory', methods=['GET'])
#@jwt_required
def get_dayhistory():
    history = []
    yesterday = datetime.date.fromordinal(datetime.date.today().toordinal())
    if request.method == 'GET':
        query = db.session.query(History).filter(History.time > yesterday).all()
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
            history.append(barista_row)
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405
