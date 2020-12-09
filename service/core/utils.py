from core.models import World, WorldField, WorldCommand
from misc.db_misc_functions import db_save
from collections import deque
from flask import request
from datetime import datetime

def forward(w):
    x = w.pos_x
    y = w.pos_y
    if w.direction[0] == "N":
        return x,y+1
    elif w.direction[0] == "S":
        return x,y-1
    elif w.direction[0] == "E":
        return x+1,y
    elif w.direction[0] == "W":
        return x-1,y

    raise Exception(f"Invalid world direction: '{ + w.direction}'")


def look_at(w):
    f = forward(w)
    yield f


def can_enter(w, x, y):
    loc = WorldField.query.filter_by(x=x, y=y,world_id=w.id).one()
    if loc is not None and loc.type == "grass":
        print(f"can enter: {loc.type}")
        return True

    return False


def make_info(w, res=None):
    if (res is None):
        res = {}

    res["name"] = w.name
    res["current_x"] = w.pos_x
    res["current_y"] = w.pos_y
    res["current_session"] = w.session
    res["direction"] = w.direction[0]
    res["step"] = w.step

    try:
        loc = WorldField.query.filter_by(x=w.pos_x, y=w.pos_x,world_id=w.id).one()
        if loc is not None:
            res["field_type"] = loc.type
            res["field_bonus"] = "" if loc.bonus is None else loc.bonus
    except:
        pass

    return res


def rotate(w, direction):
    if direction == "left":
        lst = deque(list(w.direction))
        lst.rotate(1)
        w.direction = "".join(lst)

        #############
        db_save(w)
        #############
    elif direction == "right":
        lst = deque(list(w.direction))
        lst.rotate(-1)
        w.direction = "".join(lst)

        #############
        db_save(w)
        #############
    else:
        raise Exception(f"Unrecognized direction of rotation: {direction} (expected: left / right)")

def register_step(w, command, args=None):
    s = 0 if w.step is None else w.step+1

    wc = WorldCommand(world_id=w.id)
    wc.step = s
    wc.command = command
    wc.session = w.session
    wc.host = request.remote_addr
    wc.time = datetime.now()

    if args is not None:
        wc.args = args

    #############
    db_save(wc)
    #############

    w.step = s
    db_save(w)
            