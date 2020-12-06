# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api

# local imports
from instance.config import config
import misc.constants as cn
from misc.service_logger import serviceLogger as logger
from core.db_connection import DataBase

# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
CORS(app)

# database connection
try:
    connection = DataBase().get()
    connection.close()
except Exception as ex:
    logger.error(cn.DB_UNAVAILABLE, exc_info=True)
    print("Database unavailable")
    connection = None

api = Api(title="Logo Worlds API", prefix="/worlds/api/v1", description="Logo Worlds Simulator (c) Robert Szmurlo 2020")
api.init_app(app)

# Flask app configurations
app.config['SQLALCHEMY_BINDS'] = {
                                    'bind_db': config['database']['db_url']
                                 }
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

# SQLAlchemy instantiation
db = SQLAlchemy(app)
db.create_all(bind=['bind_db'])
db.create_all()