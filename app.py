
#------------------------------------------------------------------------------
from flask import Flask, request, render_template, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from customer import customer
from barista import barista
from admin import admin
from models import db, ma
import os
from CASClient import CASClient
#------------------------------------------------------------------------------
app = Flask(__name__, template_folder = '.')
CORS(app)
app.register_blueprint(customer)
app.register_blueprint(barista)
app.register_blueprint(admin)

# Specifies up the Flask Apps configuration
config = {
    'DEBUG': True,          # some Flask specific configs
    'SQLALCHEMY_DATABASE_URI': 'mysql+pymysql://ccmobile_ccmobile_dora:COS333Account@198.199.71.236/ccmobile_coffee_club',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'JWT_SECRET_KEY': 'testkey',
    'CAS_SERVER': 'https://fed.princeton.edu',
    'CAS_AFTER_LOGIN': '/customer'
}

app.secret_key = "coffeelovers4ever"
app.config.from_mapping(config)
db.init_app(app)
ma.init_app(app)
jwt = JWTManager(app)
import models, admin, barista, customer
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
#@login_required
def index(path):
    return jsonify(msg='You put in an invalid endpoint. Try again.'), 403
#------------------------------------------------------------------------------
@app.route('/authenticate', methods=['GET'])
def authenticate():
    if request.method == 'GET':
        username = CASClient().authenticate()
        return jsonify(netid=username), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/logout', methods=['GET'])
def logout():
    if request.method == 'GET':
        username = CASClient().logout()
        return jsonify(logout = True), 200
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
