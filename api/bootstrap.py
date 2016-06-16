from flask import Flask
from flask_sqlalchemy import SQLAlchemy

__all__ = [ 'app', 'db' ]

app = Flask("sectorisation-api")
app.config.from_pyfile('config.py')

db = SQLAlchemy(app)
