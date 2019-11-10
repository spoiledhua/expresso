from flask import Blueprint, render_template, redirect, url_for, request
from .models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

barista = Blueprint('barista', 'barista')

#-------------------------------------------------------------------------------
@barista.route('/barista/login', methods = ['GET' ,'POST'])
def login_barista():
    error = None
    if request.method == 'POST':
        if request.form['username'] != 'coffeeclub' or request.form['password']!= 'kaplan123':
            error = 'Invalid Credentials. Please Try Again'
        else:
            return redirect(url_for('barista_home'))
    return render_template('index.html', error = error)

#-------------------------------------------------------------------------------
@barista.route('/barista/getorders', methods=['GET'])
def get_orders():
    # pull the orders from Order Details that are not complete
    if request.method == 'GET':
        query = db.session.query(Details).filter_by(orderstatus != 2).all()
        return jsonify(details_schema.dump(query))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@barista.route('/barista/<id>/complete', methods=['POST'])
def complete_order(id):
    # if method is Post, change order status to complete
    if request.method == 'POST':
        query = db.session.query(Details).get(orderid=id)
        if query.orderstatus is 1 or query.orderstatus is 0:
            query.orderstatus = 2
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(Details).get(orderid=id)
        return jsonify(details_schema.dump(query))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@barista.route('/barista/<orderid>/inprogress', methods=['POST'])
def in_progress():
    # if method is Post, change order status to complete
    if request.method == 'POST':
        query = db.session.query(Details).get(orderid=id)
        if query.orderstatus is 0:
            query.orderstatus = 1
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(Details).get(orderid=id)
        return jsonify(details_schema.dump(query))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@barista.route('/barista/<item_name>/changestock', methods=['POST'])
def change_stock(item_name):
    # check if username and password are barista or F3hnYbADmkiNs67Y
    # if method is post, change the Items database stock depending on 0 or 1
    # 0 means OOS and 1 means in stock
    stock_option = request.get_json()['stock']
    if request.method == 'POST':
        query = db.session.query(Items).get(item=item_name)
        if stock_option is 0:
            query.availability = 1
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        elif stock_option is 1:
            query.availability = 0
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 403
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
@barista.route('/barista/changeinventory', methods=['GET', 'POST', 'DELETE'])
def update_inventory():
    # check if username and password are admin, if not exist
    # if get, return the inventory
    # if post, update inventory item
    if request.method == 'POST':
        incoming = request.get_json()
        if incoming is None:
            return jsonify(error=True), 403
        new_item = Menu (
            item = incoming['item'],
            price = incoming['price'],
            availability = incoming['availability'],
            category = incoming['category']
        )
        return jsonify(menu_schema.dumps(new_item))
    elif request.method == 'GET':
        query = db.session.query(Menu).all()
        for item in query:
            item = menu_schema.dumps(item)
            items.append(item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 403
