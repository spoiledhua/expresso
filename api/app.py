from flask import Flask, request, render_template, jsonify, url_for, redirect, g
from flask_cas import CAS, login_required
from flask_sqlalchemy import SQLAlchemy
import os
from init import app

# initialize CAS
cas = CAS()
cas.init_app(app)
app.config['CAS_SERVER'] = 'https://fed.princeton.edu'
app.config['CAS_AFTER_LOGIN'] = 'index'

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/<path:path>', methods=['GET'])
@login_required
def any_root_path(path):
    return render_template('index.html')

@app.route('/item', methods=['GET'])
@login_required
def menu_get():
    if request.method == 'GET':
        request = request.args['item']
        query = db.session.query(request)
        return jsonify(query.all())
    else:
        return jsonify(error = True),403

@app.route('/order', methods = ['POST'])
@login_required
def place_order():
    incoming = request.args.get_json()
    order = Order(
        netid = incoming['netid'],
        payment = incoming['payment'],
        cost = incoming['cost'],
        paid = incoming['paid']
    )
    db.session.add(order)
    try:
        db.session.commit()
    except Exception as e:
        return jsonify(message=e.message), 408
    return request

@app.route('/user/<username>')
@login_required
def get_information():
    db.session.query(request)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
