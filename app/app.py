from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
#from .routes_barista import routes_barista
#from .routes_customer import routes_customer
import flask_login

app = Flask(__name__, template_folder = '.')
#app.register_blueprint(routes_barista)
#app.register_blueprint(routes_customer)

login_manager = flask_login.LoginManager()

# connects to database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://ccmobile_coffee:1Latte2G0!@198.199.71.236/ccmobile_coffee_club'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "coffeelovers4ever"


# initalizes SQL Alchemy ORM
db = SQLAlchemy(app)

# initialize Flask Login login manager
login_manager.init_app(app)

# initializes Flask Marhsmallow
ma = Marshmallow(app)

# sets SQL Alchemy Models
class History(db.Model):
    __tablename__ = 'order_history'
    netid = db.Column('netid', db.String)
    orderid = db.Column('order_id', db.Integer, primary_key=True)
    time = db.Column('timestamp', db.TIMESTAMP)
    cost = db.Column('total_cost', db.Float)
    payment = db.Column('type_of_payment', db.Boolean)
    status = db.Column('payment_status', db.Boolean)

class Details(db.Model):
    __tablename__ = 'order_details'
    id = db.Column('order_id', db.Integer, primary_key=True)
    quantity = db.Column('item_quantity', db.Integer)
    item = db.Column('item', db.String, primary_key=True)

class Menu(db.Model):
    __tablename__ = 'menu'
    item = db.Column('item', db.String, primary_key=True)
    price = db.Column('price', db.Float(asdecimal=True))
    availability = db.Column('availability', db.Boolean)

# sets Flask Marshmallow Schemas
class HistorySchema(ma.ModelSchema):
    class Meta:
        model = History
class DetailsSchema(ma.ModelSchema):
    class Meta:
        model = Details
class MenuSchema(ma.ModelSchema):
    class Meta:
        model = Menu

# sets up Login Manager for Baristas and Admin
class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return
    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return
    user = User()
    user.id = email

    user.is_authenticated = request.form['password'] == users[email]['password']
    return user
