from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cas import CAS, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import datetime as d
from .models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

#-------------------------------------------------------------------------------
# Sets up the admin routes
admin = Blueprint('admin', 'admin')
CORS(admin)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# POST request that will either upload an item and return the item
# needs to do check that the user is called admin
@admin.route('/admin/addinventory', methods=['POST'])
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
        return jsonify(menu_schema.dumps(new_item))
    else:
        return jsonify(error=True), 403

#-------------------------------------------------------------------------------
# DELETE request that takes item and deletes it from Menu, returns deleted item
@admin.route('/admin/deleteinventory', methods=['DELETE'])
def delete_inventory():
    if request.method == 'DELETE':
        query = db.session.query(Menu).filter_by(item=incoming['item'])
        try:
            deleted = query.one()
            query.delete()
            db.session.commit()
        except Exception as e:
            return jsonify(error=True), 403
        return jsonify(menu_schema.dumps(deleted))
    else:
        return jsonify(error=True), 403
