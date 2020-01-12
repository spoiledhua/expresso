# -----------------------------------------------------------------------
# server.py
# Author: Expresso server-side developers
# -----------------------------------------------------------------------
from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, session, Response
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

#-------------------------------------------------------------------------------
# GENERAL ROUTES
#-------------------------------------------------------------------------------
@app.route('/', defaults={'path':''}, methods=['GET'])
@app.route('/<path:path>')
def index(path):
    return jsonify(msg='You put in an invalid endpoint. Try again.'), 403

#-------------------------------------------------------------------------------
# CUSTOMER
#-------------------------------------------------------------------------------
@app.route('/customer/logout', methods=['GET'])
def logout():
    if request.method == 'GET':
        return jsonify(url=CASClient().logout()), 201
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/customer/getuser', methods=['GET', 'OPTIONS'])
def getuser():
    if request.method == 'GET':
        ret = CASClient().get_user()
        user = None
        if ret[0] is not None:
            user = ret[0]
            user = user[:-1]
        elif ret[1] is not None:
            return jsonify(error=True), 400
        if user is not None:
            access_token = create_access_token(identity=user, expires_delta=False)
        else:
            access_token = ''
        eligible = True
        conn = LDAP()
        conn.connect_LDAP()
        status = conn.get_pustatus(user)
        if status != 'undergraduate':
            eligible=False
        return jsonify(user=user, charge_eligible = eligible, token=access_token), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/customer/authenticate', methods=['GET', 'OPTIONS'])
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
# GET Request that returns all of the items on the menu
@app.route('/customer/menu', methods = ['GET'])
#@jwt_required
def populate_menu():
    items = []
    none = 'no_image'
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""

        query = db.session.query(Menu).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            menu_item = menu_schema.dump(item)
            picture = db.session.query(Images).filter(Images.name==item.item).all()
            if len(picture) == 0:
                picture = db.session.query(Images).filter(Images.name==none).all()
            picture = picture[0].picture
            menu_item['image'] = base64.b64encode(picture).decode('utf-8')
            items.append(menu_item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
#GET Request that returns all of the information about specified item
@app.route('/customer/menu/<item>', methods=['GET'])
def menu_get(item):
    items = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg='Cannot access endpoint'), 401"""
        item_name = item
        query = db.session.query(Menu).filter(Menu.item==item_name).all()
        if query is None:
            return jsonify(error=True), 403
        for item in query:
            if item.availability is False:
                return jsonify(availability=False), 402
        return jsonify(availability=True, items=items), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# POST Request that returns JSON of the order details that was placed
@app.route('/customer/<netid>/placeorder', methods = ['POST'])
#@jwt_required
def place_order(netid):
    receipt = {}
    receipt['items']=[]
    if request.method == 'POST':
        eastern = pytz.timezone('US/Eastern')
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        if incoming['time'] == 'Now':
            currenttime = eastern.localize(datetime.datetime.now())
        # for delayed ordering
        else:
            # get the year, month, and day for today to make datetime object
            year = datetime.date.today().year
            month = datetime.date.today().month
            day = datetime.date.today().day
            timestamp = incoming['time'].split(':')
            currenttime = eastern.localize(datetime.datetime(year, month, day, int(timestamp[0]), int(timestamp[1])))

        # check whether the items ordered are in stock
        for i in incoming['items']:
            query = db.session.query(Menu).filter_by(item=i['item']['name']).first()
            if query is None:
                return jsonify(error=True), 408
            if query.availability is False:
                return jsonify(availability=False, item=query.item), 200
            for add in i['addons']:
                addon = add['name']
                query = db.session.query(Menu).filter_by(item=addon).first()
                if query is None:
                    return jsonify(error=True), 408
                if query.availability is False:
                    return jsonify(availability=False, item=query.item), 200
        # add item to the History table
        order = History(
            netid = netid,
            time = currenttime,
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

        # add the order details to the dictionary receipt for email
        receipt['netid']= netid
        receipt['cost'] = incoming['cost']
        receipt['time'] = currenttime.strftime("%H:%M")
        receipt['type_payment']= incoming['payment']
        query = db.session.query(History).order_by(History.orderid.desc()).first()
        if query is None:
            return jsonify(error=True), 408
        id = query.orderid
        item_id = 0
        # add items to order details table
        for i in incoming['items']:
            addon_list = ''
            count = 0
            for add in i['addons']:
                addon = add['name']
                if count is 0:
                    addon_list += addon
                else:
                    addon_list += ', ' + addon
                count += 1
            if i['sp'] == 'Small' or i['sp'] == 'Large':
                item_detail = i['sp'] + ' ' + i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            else:
                item_detail = i['item']['name']
                if len(addon_list) > 0:
                    item_detail += ' w/ ' + addon_list
            object = Details(
                id = id,
                item = item_detail,
                item_id = item_id
            )
            try:
                db.session.add(object)
                db.session.commit()
                # append items to the receipt
                receipt['items'].append(item_detail)
                item_id += 1
            except Exception as e:
                return jsonify(error=True), 408
        confirmation(receipt)
        return jsonify(availability=True, item=None), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# GET Request that returns store status
@app.route('/customer/storestatus', methods=['GET'])
#@jwt_required
def get_storestatus():
    if request.method == 'GET':
        query = db.session.query(Status).all()
        return jsonify(status = query[0].open), 200
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# GET Request that returns last order
@app.route('/customer/<netid>/orderhistory', methods = ['GET'])
@jwt_required
def get_history(netid):
    past_orders = []
    if request.method == 'GET':
        """if 'username' not in session:
            return jsonify(msg = "Please login"), 401
        elif session['username'] != netid:
            return jsonify(msg = "Wrong netid"), 401"""

        query = db.session.query(History).filter_by(netid=netid).order_by(History.orderid.desc()).all()
        for orders in query:
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
            past_orders.append(barista_row)
        return jsonify(past_orders), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@app.route('/customer/<netid>/displayname', methods=['GET'])
@jwt_required
def get_display(netid):
    if request.method == 'GET':
        conn = LDAP()
        conn.connect_LDAP()
        displayname = conn.get_displayname(netid)
        if displayname == '':
            displayname = conn.get_givenname(netid)
            if displayname is '':
                displayname = netid
        return jsonify(name=displayname), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
@app.route('/customer/contact', methods=['POST'])
#@jwt_required
def contact():
    if request.method == 'POST':
        attach = {}
        try:
            incoming = request.get_json()
        except Exception as e:
            return jsonify(error=True), 400
        if incoming is None:
            return jsonify(error=True), 400
        first = incoming['firstname']
        attach['firstname'] = first
        last = incoming['lastname']
        attach['lastname'] = last
        email = incoming['email']
        attach['netid'] = email
        # regex email checker comes from Geek for Geeks
        regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
        search = re.search(regex,email)
        if (search is None):
            return jsonify(error='Invalid email'), 200
        message = incoming['message']
        attach['comment'] = message
        feedback(attach)
        return jsonify(error=None), 200
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# BARISTA
#-------------------------------------------------------------------------------
# POST request that reads in username and password, returns username if correct.
@app.route('/barista/authenticate', methods=['POST'])
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
@app.route('/barista/getuser', methods=['GET'])
@jwt_required
def barista_getuser():
    if request.method == 'GET':
        if 'user' in session:
            return jsonify(user=session.get('user')), 200
        else:
            return jsonify(user=None), 200
    else:
        return jsonify(error=True), 4
#-------------------------------------------------------------------------------
@app.route('/barista/storestatus', methods=['POST'])
def change_storestatus():
    if request.method == 'POST':
        query = db.session.query(Status).all()
        store_status = True
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
@app.route('/barista/logout', methods=['GET'])
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
@app.route('/barista/getorders', methods=['GET'])
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
@app.route('/barista/<id>/getorderstatus', methods = ['GET'])
@jwt_required
def get_orderstatus(id):
    if request.method == 'GET':
        query = db.session.query(History).get(id)
        return jsonify(status = query.order_status), 200
    else:
        return jsonify(error=True), 405
#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@app.route('/barista/<id>/complete', methods=['POST'])
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
@app.route('/barista/<id>/paid', methods=['POST'])
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
@app.route('/barista/<id>/inprogress', methods=['POST'])
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
@app.route('/barista/<item_name>/getstock', methods=['GET'])
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
@app.route('/barista/<item_name>/changestock', methods=['POST'])
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
# GET HTTP Request that gets orders from History and returns orders
@app.route('/barista/getdayhistory', methods=['GET'])
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
@app.route('/barista/availability', methods = ['GET'])
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

#-------------------------------------------------------------------------------
# ADMIN
#-------------------------------------------------------------------------------
@app.route('/admin/checkstatus', methods=['GET'])
@jwt_required
def admin_checkstatus():
    if request.method == 'GET':
        if 'user' in session:
            if session.get('user') != 'cc_admin':
                return jsonify(status='False'), 200
            else:
                return jsonify(status='True'), 200
        else:
            return jsonify(status='False'), 200
    else:
        return jsonify(error=True), 405

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
        sp = {}
        query = db.session.query(Menu).filter_by(item=incoming['name']).all()
        if len(query) > 0:
            return jsonify(item = None, error='Item already exists'), 200
        item = incoming['name']
        description = incoming['description']
        category = incoming['category']
        definition = incoming['definition']
        if incoming['noSize'] is not None:
            sp['No Size'] = incoming['noSize']
        if incoming['oneSize'] is not None:
            sp['One Size'] = incoming['oneSize']
        if incoming['smallSize'] is not None:
            sp['Small'] = incoming['smallSize']
        if incoming['largeSize'] is not None:
            sp['Large'] = incoming['largeSize']
        for i in range(0, len(sp)):
            for size in sp:
                price = sp[size]
                try:
                    float(price)
                except:
                    return jsonify(item=None, error="Price is not in correct format"), 200
                new_item = Menu (
                    item = item,
                    price = price,
                    description = description,
                    definition = definition,
                    size = size,
                    availability = True,
                    category = category
                )
                try:
                    db.session.add(new_item)
                    db.session.commit()
                except Exception as e:
                    return jsonify(error=True), 408
        return jsonify(item='Added', error=None), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# DELETE request that takes item and deletes it from Menu, returns deleted item
@app.route('/admin/<item_name>/deleteinventory', methods=['DELETE'])
def delete_inventory(item_name):
    if request.method == 'DELETE':
        deleted = []
        item_name = urllib.parse.unquote(item_name)
        query = db.session.query(Menu).filter_by(item=item_name).all()
        if len(query) == 0:
            return jsonify(error='No item found'), 408
        for menu_item in query:
            deleted.append(menu_schema.dump(menu_item))
            try:
                db.session.delete(menu_item)
                db.session.commit()
            except Exception as e:
                return jsonify(error="Could not delete item"), 403
        query2 = db.session.query(Images).filter_by(name=query[0].item).all()
        if len(query2) == 0:
            return jsonify(items=deleted), 201
        try:
            db.session.delete(query2)
            db.session.commit()
        except Exception as e:
            return jsonify(error='Could not delete image of item'), 403
        return jsonify(items=deleted), 201
    else:
        return jsonify(error=True), 405

#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
