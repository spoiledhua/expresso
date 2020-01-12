# -----------------------------------------------------------------------
# app.py
# Author: Expresso server-side developers
# -----------------------------------------------------------------------
from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort, session, Response, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, \
get_jwt_identity, verify_jwt_in_request, get_jwt_claims
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from customer import customer
from barista import barista
from admin import admin
from models import db, ma, jwt, Menu, History, Images, Barista, Status, Details, MenuSchema, HistorySchema, DetailsSchema
import os
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
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
import models, admin, barista, customer
#-------------------------------------------------------------------------------
@app.route('/', defaults={'path':''}, methods=['GET'])
@app.route('/<path:path>')
def index(path):
    return jsonify(msg='You put in an invalid endpoint. Try again.'), 403
#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
