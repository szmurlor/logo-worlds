from instance.flask_app import db
from misc.db_misc_functions import db_save
import core.models
from .models import World
from misc.service_logger import serviceLogger as logger

def bootstrapdb():
    db.drop_all()
    db.create_all()
    logger.info("Created database schema.")

    w1 = World(name="First world", token="qwerty")
    db_save(w1)
    w2 = World(name="Second world", token="qwerty123")
    db_save(w2)