from flask import Blueprint, render_template, redirect, url_for, request

barista = Blueprint('barista', __name__, template_folder='.')

@barista.route('/login_barista', methods = ['GET' ,'POST'])
def login_barista():
    error = None
    if request.method == 'POST':
        if request.form['username'] != 'coffeeclub' or request.form['password']!= 'kaplan123':
            error = 'Invalid Credentials. Please Try Again'
        else:
            return redirect(url_for('barista_home'))
    return render_template('index.html', error = error)
