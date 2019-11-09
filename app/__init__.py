from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from .customer import customer
from .barista import barista
from .models import db, ma
#from .customer import cas
import flask_login
import os

app = Flask(__name__, template_folder = '../frontend/public/')
CORS(app)
app.register_blueprint(customer)
app.register_blueprint(barista)

# connects to database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://ccmobile_coffee:1Latte2G0!@198.199.71.236/ccmobile_coffee_club'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "coffeelovers4ever"

db.init_app(app)
ma.init_app(app)
#cas.init_app(app)

app.config['CAS_SERVER'] = 'https://fed.princeton.edu'
app.config['CAS_AFTER_LOGIN'] = '/customer'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

from app import models

#------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
#------------------------------------------------------------------------------
