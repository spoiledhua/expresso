from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder = '.')
app.secret_key = "test123"
db = SQLAlchemy(app)
