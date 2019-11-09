from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cas import CAS, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import datetime as d
from .models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema
#-------------------------------------------------------------------------------
# Sets up the barista routes
barista = Blueprint('barista', 'barista')
CORS(barista)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# GET HTTP Request that gets incomplete orders from History and returns orders
@barista.route('/barista/getorders', methods=['GET'])
def get_orders():
    orders = []
    if request.method == 'GET':
        query = db.session.query(History).filter(History.order_status!=2).all()
        for items in query:
            orders.append(history_schema.dump(items))
        return jsonify(orders)
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# Change status of an item from not started or in progress to complete. Return item
@barista.route('/barista/<id>/complete', methods=['POST'])
def complete_order(id):
    if request.method == 'POST':
        query = db.session.query(History).get(id)
        if query.order_status == 1 or query.order_status == 0:
            query.order_status = 2
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        else:
            return jsonify(error=True), 408
        query = db.session.query(History).get(id)
        return jsonify(history_schema.dump(query))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# Changes status of item from not started to in progress. Returns item.
@barista.route('/barista/<orderid>/inprogress', methods=['POST'])
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
        return jsonify(history_schema.dump(query))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# Changes stock of item to the opposite of current state and returns item.
@barista.route('/barista/<item_name>/changestock', methods=['POST'])
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
            return jsonify(menu_schema.dumps(query)), 201
        elif stock_option is True:
            query.availability = False
            try:
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
            return jsonify(menu_schema.dumps(query)), 201
        else:
            return jsonify(error=True), 403
    else:
        return jsonify(error=True), 403
#-------------------------------------------------------------------------------
# Gets the inventory and returns the inventory.
@barista.route('/barista/loadinventory', methods = ['GET'])
def load_inventory():
    items = []
    if request.method == 'GET':
        query = db.session.query(Menu).all()
        for item in query:
            item = menu_schema.dumps(item)
            items.append(item)
        return jsonify(items), 200
    else:
        return jsonify(error=True), 405
