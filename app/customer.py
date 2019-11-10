from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cas import CAS, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import datetime as d
from .models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

#-------------------------------------------------------------------------------
customer = Blueprint('customer', 'customer')
CORS(customer)
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
    'items': ['S Chai Latte']
}

# initialize CAS
#cas = CAS()

#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@customer.route('/customer/menu', methods = ['GET'])
def populate_menu():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).all()
        for item in query:
            item = menu_schema.dumps(item)
            items.append(item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@customer.route('/', methods=['GET'])
#@login_required
def index():
    return render_template('index.html')

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
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@customer.route('/customer/vieworder', methods=['GET'])
#@login_required
def view_order(item):
    if request.method == 'GET':
        return

#-------------------------------------------------------------------------------
# GET request that returns the latest order placed
@customer.route('/customer/orderid', methods=['GET'])
def order_id():
    query = db.session.query(History).order_by(History.orderid.desc()).first()
    return jsonify(history_schema.dump(query)), 200

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@customer.route('/customer/makeorder', methods = ['POST'])
#@login_required
def place_order():
    ordered = []
    if request.method == 'POST':
        incoming = request.get_json()

        if incoming is None:
            return jsonify(error=True), 403

        for object in incoming['items']:
            ordered_item = Details(
                id = incoming['orderid'],
                quantity = incoming['quantity'],
                item = object
            )
            db.session.add(ordered_item)

            try:
                db.session.commit()
                ordered.append(ordered_item)
            except Exception as e:
                return jsonify(error=True), 408

        order = History(
            #netid = incoming['netid'],
            #orderid = incoming['orderid'],
            time = d.datetime.utcnow(),
            #cost = incoming['cost'],
            #payment = incoming['payment'],
            #status = incoming['status']
            order_status = 0,
            netid = 'victorhua',
            orderid = incoming['orderid'],
            cost = 3.5,
            payment = 1,
            status = 1
        )

        db.session.add(order)
        try:
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 408
        response = jsonify(menu_schema.dump(ordered))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# GET Request that returns last order
@customer.route('/customer/orderinfo', methods = ['GET'])
#@login_required
def get_information():
    user = 'dorothyz'
    history = []
    if request.method == 'GET':
        #user = request.get_json()['netid']
        try:
            order = db.session.query(History).filter_by(netid='victorhua').order_by(History.orderid.desc()).limit(1).all()
            print(order)
            for item in order:
                item = history_schema.dump(item)
                history.append(item)
            return jsonify(history), 200
        except Exception as e:
            return jsonify(error=True), 408
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
