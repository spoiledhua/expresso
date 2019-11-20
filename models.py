from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
#---------------------------------------------------------------------------
db = SQLAlchemy()
ma = Marshmallow()
#---------------------------------------------------------------------------
# sets SQL Alchemy Models
class History(db.Model):
    __tablename__ = 'order_history'
    netid = db.Column('netid', db.String)
    orderid = db.Column('order_id', db.Integer, primary_key=True)
    time = db.Column('timestamp', db.TIMESTAMP)
    cost = db.Column('total_cost', db.Float)
    payment = db.Column('type_of_payment', db.Boolean)
    status = db.Column('payment_status', db.Boolean)
    order_status = db.Column('order_status', db.Integer)

class Details(db.Model):
    __tablename__ = 'order_details'
    id = db.Column('order_id', db.Integer, primary_key=True)
    item = db.Column('item', db.String, primary_key=True)

class Menu(db.Model):
    __tablename__ = 'menu'
    size = db.Column('size', db.String, primary_key=True)
    item = db.Column('item', db.String, primary_key=True)
    price = db.Column('price', db.Float)
    availability = db.Column('availability', db.Boolean)
    category = db.Column('category', db.String)
    description = db.Column('description', db.String)

class Images(db.Model):
    __tablename__= 'images'
    name = db.Column('name', db.String, primary_key=True)
    picture = db.Column('picture', db.BLOB)

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
