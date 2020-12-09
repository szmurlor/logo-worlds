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
    pass
    #connection = DataBase().get()
    #connection.close()
except Exception as ex:
    logger.error(cn.DB_UNAVAILABLE, exc_info=True)
    print("Database unavailable")
    connection = None

api = Api(title="Logo Worlds API", prefix="/worlds/api/v1", description="Logo Worlds Simulator (c) Robert Szmurlo 2020")
api.init_app(app)

# Flask app configurations
app.config['SQLALCHEMY_DATABASE_URI'] = config['database']['db_url']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

# SQLAlchemy instantiation
db = SQLAlchemy(app)

if config["database"].as_bool("bootstrapdb"):
    from core.bootstrapdb import bootstrapdb
    bootstrapdb()


from routes.worlds import worlds

if config["database"].as_bool("dumpdb"):
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    schemas = inspector.get_schema_names()

    print(db.engine)
    for schema in schemas:
        print("schema: %s" % schema)
        for table_name in inspector.get_table_names(schema=schema):
            for column in inspector.get_columns(table_name, schema=schema):
                print("Column: %s" % column)