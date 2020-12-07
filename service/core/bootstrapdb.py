from instance.flask_app import db
from misc.db_misc_functions import db_save
import core.models
from .models import World, WorldField
from misc.service_logger import serviceLogger as logger


def bootstrapdb():
    db.drop_all()
    db.create_all()
    logger.info("Created database schema.")

    w1 = World(name="First world", token="qwerty")
    w1.pos_x = 1
    w1.pos_y = 1
    w1.direction = "E"
    db_save(w1)
    w2 = World(name="Second world", token="qwerty123")
    db_save(w2)

    a = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    for x, r in enumerate(a):
        for y, c in enumerate(r):
            if c == 0:
                wf = WorldField(type="wall", x=x, y=y, world_id=w1.id)
            else:
                wf = WorldField(type="grass", x=x, y=y, world_id=w1.id)
            db_save(wf)
