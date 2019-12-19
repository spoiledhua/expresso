from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint, session
from flask_cors import CORS
import hashlib
from flask_sqlalchemy import SQLAlchemy
import datetime, pytz
from models import db, Menu, History, Details, Barista, MenuSchema, HistorySchema, DetailsSchema
from jwtprotected import add_claims_to_access_token, barista_required
#-------------------------------------------------------------------------------
# Sets up the barista routes
barista = Blueprint('barista', 'barista')
CORS(barista)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()
#-------------------------------------------------------------------------------
# BARISTA
#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/authenticate', methods=['POST'])
def barista_authenticate():
    if request.method == 'POST':
        __salt = '603878825b374f5aab78b81370b30157'
        incoming = request.get_json()
        username = incoming['username']
        password = incoming['password']
        password = password + __salt
        #print(password)
        encrypted_password = hashlib.sha256(password.encode()).hexdigest()

        userinfo = db.session.query(Barista).filter(Barista.username == username).all()
        if len(userinfo) == 0:
            return jsonify(msg = 'Invalid Login'), 200
        else:
            userinfo = userinfo[0]
        if userinfo.password == encrypted_password:
            session['user'] = username
            return jsonify(user= session['user'], url='http://coffeeclub.princeton.edu/barista'), 200
        else:
            return jsonify(msg = "Invalid Login"), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET request that reads in username and password, returns username if correct.
@barista.route('/barista/getuser', methods=['GET'])
def barista_getuser():
    if request.method == 'GET':
        if 'user' in session:
            return jsonify(user=session['user']), 200
        else:
            return jsonify(user=None), 200
    else:
        return jsonify(error=True), 4

#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/logout', methods=['GET'])
def barista_logout():
    if request.method != 'GET':
        return jsonify(error=True), 405
    try:
        if 'user' in session:
            session.clear()
            add_claims_to_access_token(None)
            return jsonify(user=None), 200
        else:
            return jsonify(error=True), 401
    except Exception as e:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
# with the oldest request first
@barista.route('/barista/getorders', methods=['GET'])
def get_orders():
    current_orders = []
    if request.method == 'GET':
        if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401

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
            barista_row['order_status'] = orders.order_status
            #print(barista_row)
            current_orders.append(barista_row)
        return jsonify(current_orders), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Gets the status of the item
@barista.route('/barista/<id>/getorderstatus', methods = ['GET'])
def get_orderstatus(id):
    if request.method == 'GET':
        if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401
        query = db.session.query(History).get(id)
        return jsonify(status = query.order_status), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@barista.route('/barista/<id>/complete', methods=['POST'])
def complete_order(id):
    if request.method == 'POST':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""
        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.status == 1:
            query.order_status = 2
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(History).get(id)
        return jsonify(status=query.order_status), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete once
#the person has paid. Return item.
@barista.route('/barista/<id>/paid', methods=['POST'])
def paid_order(id):
    if request.method == 'POST':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""

        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.payment == 0:
            query.status = 1
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(msg='Already paid'), 200
        query = db.session.query(History).get(id)
        return jsonify(history_schema.dump(query)), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Changes status of item from not started to in progress. Returns item.
@barista.route('/barista/<orderid>/inprogress', methods=['POST'])
def in_progress(orderid):
    if request.method == 'POST':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""

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
        return jsonify(status=query.order_status), 201
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Changes stock of item to the opposite of current state and returns item.
@barista.route('/barista/<item_name>/getstock', methods=['GET'])
def get_stock(item_name):
    if request.method == 'GET':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""

        query = db.session.query(Menu).filter_by(item=item_name).one()
        return jsonify(stock=query.availability), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Changes stock of item to the opposite of current state and returns item.
@barista.route('/barista/<item_name>/changestock', methods=['POST'])
def change_stock(item_name):
    if request.method == 'POST':
        item_name = urllib.parse.unquote(item_name)
        """item_name = item_name.split('%20')
        separator = ' '
        item_name = separator.join(item_name)"""
        #print(item_name)
        #url = urllib.parse.urlparse(urllib.parse.unquote(request.url))
        #item_name = url.path.split('/')[2]
        query = db.session.query(Menu).filter_by(item=item_name).all()
        availability = None
        name = ''
        category = None
        # if the item is not in the Menu, return an error
        if query is None:
            return jsonify(error=True), 405
        # changing the availability of the selected item
        for item in query:
            name = item.item
            stock_option = item.availability
            if stock_option is False:
                item.availability = True
                availability = True
                category = item.category
                try:
                    db.session.commit()
                except Exception as e:
                    return jsonify(error=True), 408
            elif stock_option is True:
                item.availability = False
                availability = False
                category = item.category
                try:
                    db.session.commit()
                except Exception as e:
                    return jsonify(error=True), 408
            else:
                return jsonify(error=True), 403
        return jsonify(item=name, availability=availability, category=category), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# Gets the inventory and returns the inventory.
@barista.route('/barista/loadinventory', methods = ['GET'])
def load_inventory():
    items = []
    if request.method == 'GET':
        if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401

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
def get_allhistory():
    history = []
    if request.method == 'GET':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""

        query = db.session.query(History).order_by(History.time.desc()).limit(20).all()
        for orders in query:
            items = db.session.query(Details).filter(Details.id==orders.orderid).all()
            item_names = []
            for item in items:
                item_names.append(item.item)
            localtime = pytz.timezone('US/Eastern').localize(orders.time)
            barista_row = {}
            barista_row['item'] = item_names
            barista_row['netid'] = orders.netid
            barista_row['time'] = localtime
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
def get_dayhistory():
    history = []
    yesterday = datetime.date.fromordinal(datetime.date.today().toordinal())
    if request.method == 'GET':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401"""

        query = db.session.query(History).filter(History.time > yesterday).order_by(History.time.desc()).all()
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
# GET Request that returns all of the items on the menu
@barista.route('/barista/availability', methods = ['GET'])
def all_availability():
    items = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""
        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            menu_item = menu_schema.dump(item)
            items.append(menu_item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405
