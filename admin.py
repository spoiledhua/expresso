from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
from models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema
from jwtprotected import add_claims_to_access_token, admin_required
#-------------------------------------------------------------------------------
# Sets up the admin routes
admin = Blueprint('admin', 'admin')
CORS(admin)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
# ADMIN
#-------------------------------------------------------------------------------
@admin.route('/admin/checkstatus', methods=['GET'])
def admin_checkstatus():
    if request.method == 'GET':
        if 'user' in session:
            if session['user'] != 'cc_admin':
                return jsonify(error='Access Denied'), 402
            else:
                return jsonify(status='admin'), 200
        else:
            return jsonify(error='Access Denied'), 402
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# POST request that will either upload an item and return the item
# needs to do check that the user is called admin
@admin.route('/admin/addinventory', methods=['POST'])
def add_inventory():
    incoming = request.get_json()
    if incoming is None:
        return jsonify(error=True), 403
    if request.method == 'POST':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401
        elif session['user'] != 'cc_admin':
            return jsonify(msg = 'Cannot access endpoint'), 401"""
        query = db.session.query(Menu).filter_by(item=incoming['item']).all()
        if len(query) > 0:
            return jsonify(msg='Item exists'), 200
        for i in range(0, len(incoming['price'])):
            if 'size' not in incoming:
                size = 'One Size'
            else:
                size = incoming['size'][i]
            new_item = Menu (
                item = incoming['item'],
                price = incoming['price'][i],
                description = incoming['description'],
                size = size,
                availability = True,
                category = incoming['category']
                )
            try:
                db.session.add(new_item)
                db.session.commit()
            except Exception as e:
                return jsonify(error=True), 408
        return jsonify(item=menu_schema.dump(new_item), msg=None), 201
    else:
        return jsonify(error=True), 405

#-------------------------------------------------------------------------------
# DELETE request that takes item and deletes it from Menu, returns deleted item
@admin.route('/admin/<item_name>/deleteinventory', methods=['DELETE'])
def delete_inventory(item_name):
    if request.method == 'DELETE':
        """if 'user' not in session:
            return jsonify(msg = 'Cannot access endpoint'), 401
        elif session['user'] != 'cc_admin':
            return jsonify(msg = 'Cannot access endpoint'), 401"""
        deleted = []
        query = db.session.query(Menu).filter_by(item=item_name).all()
        if len(query) == 0:
            return jsonify(items=deleted), 201
        for menu_item in query:
            deleted.append(menu_schema.dump(menu_item))
            try:
                db.session.delete(menu_item)
                db.session.commit()
            except Exception as e:
                return jsonify(error="Error here"), 403

        query = db.session.query(Images).filter_by(name=query[0].item).all()
        if len(query) == 0:
            return jsonify(items=deleted), 201

        try:
            db.session.delete(query)
            db.session.commit()
        except Exception as e:
            return jsonify(error='True'), 403
        return jsonify(items=deleted), 201
    else:
        return jsonify(error=True), 405
