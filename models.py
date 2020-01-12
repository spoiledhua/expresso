# -----------------------------------------------------------------------
# models.py
# Author: Expresso server-side developers
# -----------------------------------------------------------------------
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
#---------------------------------------------------------------------------
db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
#---------------------------------------------------------------------------
# sets SQL Alchemy Models
class History(db.Model):
    __tablename__ = 'order_history'
    netid = db.Column('netid', db.String)
    orderid = db.Column('order_id', db.Integer, primary_key=True)
    time = db.Column('timestamp', db.DATETIME)
    cost = db.Column('total_cost', db.Float)
    payment = db.Column('type_of_payment', db.Boolean)
    status = db.Column('payment_status', db.Boolean)
    order_status = db.Column('order_status', db.Integer)

class Details(db.Model):
    __tablename__ = 'order_details'
    id = db.Column('order_id', db.Integer, primary_key=True)
    item = db.Column('item', db.String)
    item_id = db.Column('item_id', db.Integer, primary_key=True)

class Menu(db.Model):
    __tablename__ = 'menu'
    size = db.Column('size', db.String, primary_key=True)
    item = db.Column('item', db.String, primary_key=True)
    price = db.Column('price', db.Float)
    availability = db.Column('availability', db.Boolean)
    category = db.Column('category', db.String)
    description = db.Column('description', db.String)
    definition = db.Column('definition', db.String)

class Images(db.Model):
    __tablename__= 'images'
    name = db.Column('item', db.String, primary_key=True)
    picture = db.Column('picture', db.BLOB)

class Status(db.Model):
    __tablename__= 'store_status'
    open = db.Column('store_open', db.Boolean, primary_key=True)

class Barista(db.Model):
    __tablename__= 'valid_barista_users'
    username = db.Column('username', db.String, primary_key=True)
    password = db.Column('password', db.String)

#---------------------------------------------------------------------------
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
