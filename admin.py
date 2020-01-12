# -----------------------------------------------------------------------
# admin.py
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
# Sets up the admin routes
admin = Blueprint('admin', 'admin')
CORS(admin, supports_credentials=True)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# ADMIN
#-------------------------------------------------------------------------------
@admin.route('/admin/checkstatus', methods=['GET'])
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
@admin.route('/admin/addinventory', methods=['POST'])
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
@admin.route('/admin/<item_name>/deleteinventory', methods=['DELETE'])
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
