import time
from app import db

class Order(db.Model):
    netid = db.Column(db.String(64), unique=False)
    orderid = db.Column(db.String(64), default = time.time_ns(), primary_key=True, unique=True)
    time = db.Column(db.DateTime(), default = datetime.utcnow())
    payment = db.Column(db.Int())
    cost = db.Column(db.Float())
    paid = db.Column(db.Boolean()))
    history = db.relationship('Details', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.netid)

class Details(db.Model):
    orderid = db.Column(db.String(64), default = time.time_ns(), primary_key=True, unique=True)


class Menu(db.Model):
    item = db.Column(db.String(64), unique=True)
    prices = db.Column(db.Float())
    availability = db.Column(db.Boolean())
    
    def __repr__(self):
        return '<Item {}>'.format(self.item)
