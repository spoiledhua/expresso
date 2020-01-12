# -----------------------------------------------------------------------
# barista.py
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
# Sets up the barista routes
barista = Blueprint('barista', 'barista')
CORS(barista, supports_credentials=True)
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
        if incoming is None:
            return jsonify(error=True), 408
        username = incoming['username']
        password = incoming['password']
        if len(username) == 0 or len(password) == 0:
            return jsonify(msg='Invalid Login'), 401
        password = password + __salt
        encrypted_password = hashlib.sha256(password.encode()).hexdigest()

        userinfo = db.session.query(Barista).filter(Barista.username == username).all()
        if len(userinfo) == 0:
            return jsonify(msg = 'Invalid Login'),  401
        else:
            userinfo = userinfo[0]
        if userinfo.password == encrypted_password:
            session['user'] = username
            access_token = create_access_token(identity=username, expires_delta=False)
            return jsonify(token=access_token), 200
        else:
            return jsonify(msg = "Invalid Login"),  401
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET request that reads in username and password, returns username if correct.
@barista.route('/barista/getuser', methods=['GET'])
#@jwt_required
def barista_getuser():
    if request.method == 'GET':
        if 'user' in session:
            return jsonify(user=session.get('user')), 200
        else:
            return jsonify(user=None), 200
    else:
        return jsonify(error=True), 4
#-------------------------------------------------------------------------------
@barista.route('/barista/storestatus', methods=['POST'])
def change_storestatus():
    if request.method == 'POST':
        query = db.session.query(Status).all()
        store_status = True
        print(query[0].open)
        if query[0].open is True:
            query[0].open = False
            store_status = query[0].open
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            query[0].open = True
            store_status = query[0].open
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        return jsonify(status=store_status), 200
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@barista.route('/barista/logout', methods=['GET'])
def barista_logout():
    if request.method != 'GET':
        return jsonify(error=True), 405
    try:
        session.clear()
    except Exception as e:
        return jsonify(error=True), 403
    return jsonify(user=None), 200

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
# with the oldest request first
@barista.route('/barista/getorders', methods=['GET'])
@jwt_required
def get_orders():
    current_orders = []
    if request.method == 'GET':
        query = db.session.query(History).filter(History.order_status!=2).order_by(History.time.asc()).all()
        eastern = pytz.timezone('US/Eastern')
        for orders in query:
            if eastern.localize(orders.time) <= eastern.localize(datetime.datetime.now()):
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
                barista_row['order_status'] = orders.order_status
                current_orders.append(barista_row)
        return jsonify(current_orders), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Gets the status of the item
@barista.route('/barista/<id>/getorderstatus', methods = ['GET'])
@jwt_required
def get_orderstatus(id):
    if request.method == 'GET':
        query = db.session.query(History).get(id)
        return jsonify(status = query.order_status), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@barista.route('/barista/<id>/complete', methods=['POST'])
#@jwt_required
def complete_order(id):
    if request.method == 'POST':
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
        #completed(query.netid)
        return jsonify(status=query.order_status), 201
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
        if (query.status == 0) and (query.payment == 0):
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
@barista.route('/barista/<id>/inprogress', methods=['POST'])
#@jwt_required
def in_progress(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if query is None:
            return jsonify(error=True), 408
        if query.order_status is 0:
            query.order_status = 1
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
# Changes stock of item to the opposite of current state and returns item.
@barista.route('/barista/<item_name>/getstock', methods=['GET'])
@jwt_required
def get_stock(item_name):
    if request.method == 'GET':
        query = db.session.query(Menu).filter_by(item=item_name).first()
        if query is None:
            return jsonify(error=True), 408
        return jsonify(stock=query.availability), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Changes stock of item to the opposite of current state and returns item.
@barista.route('/barista/<item_name>/changestock', methods=['POST'])
#@jwt_required
def change_stock(item_name):
    if request.method == 'POST':
        item_name = urllib.parse.unquote(item_name)
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
# GET HTTP Request that gets orders from History and returns orders
@barista.route('/barista/getdayhistory', methods=['GET'])
@jwt_required
def get_dayhistory():
    history = []
    yesterday = datetime.date.fromordinal(datetime.date.today().toordinal())
    if request.method == 'GET':
        query = db.session.query(History).filter(History.time > yesterday).order_by(History.time.desc()).all()
        for orders in query:
            items = db.session.query(Details).filter(Details.id==orders.orderid).all()
            item_names = []
            for item in items:
                item_names.append(item.item)
            barista_row = {}
            barista_row['item'] = item_names
            barista_row['netid'] = orders.netid
            barista_row['time'] = str(orders.time) + " EST"
            barista_row['orderid'] = orders.orderid
            barista_row['status'] = orders.status
            barista_row['cost'] = orders.cost
            barista_row['payment'] = orders.payment
            history.append(barista_row)
        return jsonify(history), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@barista.route('/barista/availability', methods = ['GET'])
@jwt_required
def all_availability():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 408
        for item in query:
            menu_item = menu_schema.dump(item)
            items.append(menu_item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405
