from flask import Flask, request, render_template, jsonify, url_for, redirect, g, abort
from flask_cas import CAS, login_required
from flask_sqlalchemy import SQLAlchemy
import os
import datetime as d
from app import app, db, Menu, History, Details, MenuSchema, HistorySchema, DetailsSchema

# used to serialize queries from different models
menu_schema = MenuSchema()
history_schema = HistorySchema()
details_schema = DetailsSchema()

incoming = {
    'netid': 'dorothyz',
    'orderid': 4,
    'cost': 8.50,
    'payment': 1,
    'status': False,
    'items': ['S Chai Latte', 'Brownie']
}

# initialize CAS
cas = CAS()
cas.init_app(app)
app.config['CAS_SERVER'] = 'https://fed.princeton.edu'
app.config['CAS_AFTER_LOGIN'] = 'index'

@app.route('/')
@app.route('/<path:path>', methods=['GET'])
#@login_required
def index():
    return render_template('index.html')

@app.route('/<item>', methods=['GET'])
#@login_required
def menu_get():
    if request.method == 'GET':
        request = request.get_json()['item']
        query = db.session.query(Menu).get(request)
        return jsonify(menu_schema.dump(query))
    else:
        return jsonify(error = True), 403

@app.route('/order', methods = ['POST'])
#@login_required
# think about duplicate items
def place_order():
    #incoming = request.get_json()
    for object in incoming['items']:
        print(object)
        ordered_item = Details(
            id = incoming['orderid'],
            item = object
        )

        db.session.add(ordered_item)

        try:
            db.session.commit()
        except Exception as e:
            print(e)
            return jsonify(message=e), 408

    order = History(
        netid = incoming['netid'],
        orderid = incoming['orderid'],
        time = d.datetime.utcnow(),
        cost = incoming['cost'],
        payment = incoming['payment'],
        status = incoming['status']
    )

    db.session.add(order)
    try:
        db.session.commit()
    except Exception as e:
        print(e)
        exit(1)
        #return jsonify(message=e), 408
    return request

@app.route('/user/<username>')
#@login_required
def get_information():
    user = 'dorothyz'
    history = []
    #user = request.get_json()['netid']
    try:
        query = db.session.query(History).filter_by(netid = user).limit(10)
        with app.app_context():
            for order in query.all():
                past_order = jsonify(history_schema.dump(order))
                print(past_order)
                history.append(past_order)
            return history
    except Exception as e:
        return jsonify(message=e), 408

if __name__ == '__main__':
    get_information()
    #app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
