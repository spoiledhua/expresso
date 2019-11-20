from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, Blueprint
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required
from flask_sqlalchemy import SQLAlchemy
from models import db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

#-------------------------------------------------------------------------------
# Sets up the admin routes
admin = Blueprint('admin', 'admin')
CORS(admin)
# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

#-------------------------------------------------------------------------------
@admin.route('/admin/authenticate', methods=['POST'])
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
@admin.route('/admin/addinventory', methods=['POST'])
@jwt_required
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
@admin.route('/admin/deleteinventory', methods=['DELETE'])
@jwt_required
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
