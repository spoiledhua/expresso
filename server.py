from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, session
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from models import db, ma, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema
import os, pytz, base64, datetime
from CASClient import CASClient
#------------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True)
application = app
# Specifies up the Flask Apps configuration
config = {
    'DEBUG': True,          # some Flask specific configs
    'SQLALCHEMY_DATABASE_URI': 'mysql+pymysql://ccmobile_ccmobile_dora:COS333Account@198.199.71.236/ccmobile_coffee_club',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'JWT_SECRET_KEY': 'testkey',
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
# GENERAL ROUTES
#-------------------------------------------------------------------------------
@app.route('/gettoken', methods=['GET'])
def get_token():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    __password = 'test'
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    password = generate_password_hash(password)
    app_pass = generate_password_hash(__password)
    if username == 'coffeeclubtester' or password == app_pass:
        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
#-------------------------------------------------------------------------------
@app.route('/', defaults={'path':''}, methods=['GET'])
@app.route('/<path:path>')
@login_required
def index(path):
    return jsonify(msg='You put in an invalid endpoint. Try again.'), 403

#------------------------------------------------------------------------------
@app.route('/logout', methods=['GET'])
@login_required
def logout():
    if request.method == 'GET':
        return jsonify(url=CASClient().logout()), 201
        #return jsonify(logout = True), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/getuser', methods=['GET', 'OPTIONS'])
@login_required
def getuser():
    if request.method == 'GET':
        ret = CASClient().get_user()
        user = None
        if ret[0] is not None:
            user = ret[0]
        elif ret[1] is not None:
            return jsonify(error=True), 400
        return jsonify(user=user), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/authenticate', methods=['GET', 'OPTIONS'])
@login_required
def authenticate():
    if request.method == 'GET':
        ret = CASClient().authenticate()
        if ret[0] is None and ret[1] is not None:
            return jsonify(user = ret[0], url = ret[1]), 200
        elif ret[0] is not None and ret[1] is not None:
            return jsonify(user = ret[0], url = 'http://coffeeclub.princeton.edu'), 200
        else:
            return redirect('http://coffeeclub.princeton.edu/menu')
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# CUSTOMER
#-------------------------------------------------------------------------------
# GET Request that returns all of the items on the menu
@app.route('/customer/menu', methods = ['GET'])
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
@app.route('/customer/menu/<item>', methods=['GET'])
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
@app.route('/customer/orderid', methods=['GET'])
#@jwt_required
def order_id():
    if request.method == 'GET':
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        return jsonify(history_schema.dump(query)), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@app.route('/customer/placeorder', methods = ['POST'])
#@jwt_required
def place_order():
    ordered = []
    if request.method == 'POST':
        try:
            #incoming = request.get_json()
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
                item_detail = i['sp'][0] + ' ' + i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            else:
                item_detail = i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            print(item_detail)
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
@app.route('/customer/orderinfo', methods = ['GET'])
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
@app.route('/customer/<netid>/orderhistory', methods = ['GET'])
#@jwt_required
def get_history(netid):
    netid = netid + '\n'
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

#-------------------------------------------------------------------------------
# BARISTA
#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@app.route('/barista/authenticate', methods=['POST'])
#@jwt.authenticate
def barista_authenticate():
    if request.method == 'POST':
        incoming = request.get_json()
        username = incoming['username']
        password = incoming['password']
        password = generate_password_hash(password)
        __password = 'dora'

        if 'user' in session:
            return jsonify(user = session.get('user'), url = None)

        else:
            if username == 'dora' and check_password_hash(password, __password):
                session['user'] = 'dora'
                return jsonify(user= session['user'], url='http://coffeeclub.princeton.edu/barista'), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@app.route('/barista/getuser', methods=['GET'])
#@jwt.authenticate
def barista_getuser():
    if request.method == 'GET':
        if 'user' in session:
            return jsonify(user=session['user']), 200
        else:
            return jsonify(user=None), 200
    else:
        return jsonify(error=True), 405


#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@app.route('/barista/logout', methods=['GET'])
#@jwt.authenticate
def barista_logout():
    if request.method != 'GET':
        return jsonify(error=True), 405
    try:
        if 'user' in session:
            session.clear()
            return jsonify(user=None), 200
        else:
            return jsonify(msg = 'No user'), 200
    except Exception as e:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
# with the oldest request first
@app.route('/barista/getorders', methods=['GET'])
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
@app.route('/barista/<id>/complete', methods=['POST'])
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
@app.route('/barista/<id>/paid', methods=['POST'])
#@jwt_required
def paid_order(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if (query.order_status == 1 or query.order_status == 0) and query.payment == 0:
            query.order_status = 2
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
@app.route('/barista/<orderid>/inprogress', methods=['POST'])
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
@app.route('/barista/<item_name>/changestock', methods=['POST'])
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
@app.route('/barista/loadinventory', methods = ['GET'])
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
@app.route('/barista/getallhistory', methods=['GET'])
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
@app.route('/barista/getdayhistory', methods=['GET'])
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
#-------------------------------------------------------------------------------
# ADMIN
#-------------------------------------------------------------------------------
# POST request that will either upload an item and return the item
# needs to do check that the user is called admin
@app.route('/admin/authenticate', methods=['POST'])
def admin_authenticate():
    if request.method != 'POST':
        return jsonify(error=True), 405

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    #username = request.json.get('username', None)
    #password = request.json.get('password', None)
    username = 'coffeeclub_admin'
    password = 'SingleOrigin123'
    __password = 'SingleOrigin123'
    if not username:
        return jsonify(username=None), 400
    if not password:
        return jsonify(username=None), 400
    password = generate_password_hash(password)
    if username == 'coffeeclub_admin' or check_password_hash(password, __password):
        # Identity can be any data that is json serializable
        return jsonify(username=username), 200
    else:
        return jsonify(username=None), 401

#-------------------------------------------------------------------------------
# POST request that will either upload an item and return the item
# needs to do check that the user is called admin
@app.route('/admin/addinventory', methods=['POST'])
#@jwt_required
def add_inventory():
    incoming = request.get_json()
    if incoming is None:
        return jsonify(error=True), 403
    if request.method == 'POST':
        try:
            new_item = Menu (
                item = incoming['item'],
                price = incoming['price'],
                availability = incoming['availability'],
                category = incoming['category']
                )
            db.session.add(new_item)
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 408
        return jsonify(menu_schema.dump(new_item))
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# DELETE request that takes item and deletes it from Menu, returns deleted item
@app.route('/admin/deleteinventory', methods=['DELETE'])
#@jwt_required
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
