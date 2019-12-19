from flask import Flask, request, render_template, jsonify, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, \
get_jwt_identity, verify_jwt_in_request, get_jwt_claims
from werkzeug.security import generate_password_hash
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from customer import customer
from barista import barista
from admin import admin
from models import db, ma
from jwtprotected import jwt, add_claims_to_access_token
import os
from CASClient import CASClient
#------------------------------------------------------------------------------
app = Flask(__name__, template_folder = '.')
CORS(app, supports_credentials=True)
app.register_blueprint(customer)
app.register_blueprint(barista)
app.register_blueprint(admin)

# Specifies up the Flask Apps configuration
config = {
    'DEBUG': True,          # some Flask specific configs
    'SQLALCHEMY_DATABASE_URI': 'mysql+pymysql://ccmobile_ccmobile_dora:COS333Account@198.199.71.236/ccmobile_coffee_club',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'JWT_SECRET_KEY': b'E\xa6\xb7%\xa5I\x0e\xce\x82(7\x14qG\x1e\xc9'
}

app.secret_key = b'\x06\x99\x99hR\x9a\x16\xae\x0f\xe6_\xf3\x0en\xe0\xda'
app.config.from_mapping(config)
db.init_app(app)
ma.init_app(app)
jwt.init_app(app)
import models, admin, barista, customer, jwtprotected
#-------------------------------------------------------------------------------
@app.route('/gettoken', methods=['GET'])
def get_token():
    username = None
    if 'user' in session:
        username = session['user']
    elif 'username' in session:
        username = session['username']

    if username is not None:
        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
#-------------------------------------------------------------------------------
@app.route('/', defaults={'path':''}, methods=['GET'])
@app.route('/<path:path>')
def index(path):
    return jsonify(msg='You put in an invalid endpoint. Try again.'), 403

#------------------------------------------------------------------------------
@app.route('/logout', methods=['GET'])
def logout():
    if request.method == 'GET':
        return jsonify(url=CASClient().logout()), 201
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
@app.route('/getuser', methods=['GET', 'OPTIONS'])
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
def authenticate():
    if request.method == 'GET':
        ret = CASClient().authenticate()
        if ret[0] is None and ret[1] is not None:
            return jsonify(user = ret[0], url = ret[1]), 200
        else:
            add_claims_to_access_token(ret[0])
            return redirect('http://www.google.com')
    else:
        return jsonify(error=True), 403
#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
