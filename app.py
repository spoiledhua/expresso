from flask import Flask
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from customer import customer, cache
from barista import barista
from admin import admin
from models import db, ma
import flask_login
import os

#------------------------------------------------------------------------------
app = Flask(__name__, template_folder = '.')
CORS(app)
app.register_blueprint(customer)
app.register_blueprint(barista)
app.register_blueprint(admin)

# Specifies up the Flask Apps configuration
config = {
    'DEBUG': True,          # some Flask specific configs
    'SQLALCHEMY_DATABASE_URI': 'mysql+mysqlconnector://ccmobile_coffee:1Latte2G0!@198.199.71.236/ccmobile_coffee_club',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'CAS_SERVER': 'https://fed.princeton.edu',
    'CAS_AFTER_LOGIN': '/customer'
}

app.secret_key = "coffeelovers4ever"
app.config.from_mapping(config)
db.init_app(app)
ma.init_app(app)
cache.init_app(app)

import models

#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080), debug=True)
#------------------------------------------------------------------------------
