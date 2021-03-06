from core.models import World, WorldField, WorldCommand
from misc.db_misc_functions import db_save
from collections import deque
from flask import request
from datetime import datetime

def forward(w,left=False,right=False):
    
    x = w.pos_x
    y = w.pos_y

    if w.direction[0] == "N":
        return x+(1 if left else -1 if right else 0),y+1
    elif w.direction[0] == "S":
        return x+(-1 if left else 1 if right else 0),y-1
    elif w.direction[0] == "E":
        return x+1,y+(1 if left else -1 if right else 0)
    elif w.direction[0] == "W":
        return x-1,y+(-1 if left else 1 if right else 0)

    raise Exception(f"Invalid world direction: '{ + w.direction}'")


def look_at(w):
    fl = forward(w, left=True) 
    yield fl
    f = forward(w)
    yield f
    fr = forward(w, right=True) 
    yield fr


def can_enter(w, x, y):
    loc = WorldField.query.filter_by(x=x, y=y,world_id=w.id).one()
    if loc is not None and loc.type in ("grass","sand"):
        print(f"can enter: {loc.type} at ({x},{y})")
        return True
    else:
        print(f"can not enter: {loc.type} at ({x},{y})")

    return False


def cost_of_enter(w, x, y):
    loc = WorldField.query.filter_by(x=x, y=y,world_id=w.id).one()
    if loc is not None and loc.type == "grass":
        return 1
    elif loc is not None and loc.type == "sand":
        return 3
    else:
        print(f"can not enter: {loc.type} at ({x},{y})")

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
        loc = WorldField.query.filter_by(x=w.pos_x, y=w.pos_y,world_id=w.id).one()
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
    w.step = s
    db_save(w)
    #############
            