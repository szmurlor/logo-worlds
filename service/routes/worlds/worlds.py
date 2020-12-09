import json
import functools
import uuid
from flask import request
from flask_restx import Resource, fields, marshal

# local imports
from core.models import World, WorldField
from core.utils import *
import misc.constants as cn
from instance.flask_app import api
from misc.response_generator import response_generator
from misc.service_logger import serviceLogger as logger
from namespace import worlds_api
from misc.db_misc_functions import db_save
from instance.config import config

from routes.worlds.reponses import *

parser = api.parser()

def worlds_answer(fun):
    @functools.wraps(fun)
    def _wrapper(*args,**kwargs):
        error = None
        payload = ""
        try:
            payload = fun(*args, **kwargs)
        except Exception as e:
            status = "Error"
            error = str(e)
        if error is None:
            return {
                "status": "Success",
                "payload": payload
            }
        else:
            return {
                "status": "Error",
                "error": error,
                "payload": payload
            }

    return _wrapper



@worlds_api.route("/info/<string:token>")
class WorldClass(Resource):
    @api.marshal_with(world_info_response, skip_none=True)
    @worlds_answer
    def get(self, token):
        w = World.query.filter_by(token=token).one()

        if (w is not None):
            register_step(w, 'info')
        else:
            raise Exception( f"Unable to find world with token: '{token}'" )

        return make_info(w)

    # @api.expect(world_command)
    # @api.marshal_with(world_response)
    # def post(self, token):
    #     print(f"{api.payload}")
    #     return {"name": api.payload["name"], "state": "zupa"}


@worlds_api.route("/move/<string:token>")
class MoveClass(Resource):

    @api.marshal_with(move_response, skip_none=True)
    @worlds_answer
    def get(self, token):
        res = {}
        w = World.query.filter_by(token=token).one()

        if (w is not None):
            register_step(w, 'forward')
            (x,y) = forward(w)
            if (can_enter(w, x, y)):
                w.pos_x = x
                w.pos_y = y

                ###########
                db_save(w)
                ###########
    
        return make_info(w)


@worlds_api.route("/explore/<string:token>")
class ExploreClass(Resource):

    @api.marshal_with(explore_response, skip_none=True)
    @worlds_answer
    def get(self, token):
        res = {}
        w = World.query.filter_by(token=token).one()

        if (w is not None):
            register_step(w, 'explore')
            res["fields"] = []
            for x,y in look_at(w):
                loc = WorldField.query.filter_by(x=x, y=y,world_id=w.id).one()
                
                if loc is not None:
                    res["fields"].append( {"x": x, 
                                    "y": y, 
                                    "type": loc.type
                                    } 
                                )
                else:
                    res["fields"].append( {"x": x, "y": y, type: "not found"} )
                
        else:
            raise Exception( f"Unable to find world with token: '{token}'" )

        return res


@worlds_api.route("/reset/<string:token>")
class ResetClass(Resource):

    @api.marshal_with(world_info_response, skip_none=True)
    @worlds_answer
    def get(self, token):
        w = World.query.filter_by(token=token).one()
        if w is not None:
            w.step = 0
            w.pos_x = 1
            w.pos_y = 1
            w.session = str(uuid.uuid4())
            register_step(w, 'reset', w.session)

            ############
            db_save(w)
            ############
        
        return make_info(w)

    # @api.expect(world_command)
    # @api.marshal_with(world_response)
    # def post(self, token):
    #     print(f"{api.payload}")
    #     return {"name": api.payload["name"], "state": "zupa"}


@worlds_api.route("/rotate/<string:token>/<string:direction>")
class RotateClass(Resource):

    @api.marshal_with(rotate_response, skip_none=True)
    @worlds_answer
    def get(self, token, direction):
        w = World.query.filter_by(token=token).one()
        if w is not None:
            register_step(w, 'rotate', direction)
            rotate(w, direction)
        
        return make_info(w)

    # @api.expect(world_command)
    # @api.marshal_with(world_response)
    # def post(self, token):
    #     print(f"{api.payload}")
    #     return {"name": api.payload["name"], "state": "zupa"}

@worlds_api.route("/history/<string:token>/<string:session>")
class HistoryClass(Resource):

    @api.marshal_with(history_response, skip_none=True)
    @worlds_answer
    def get(self, token, session):
        res = {}
        w = World.query.filter_by(token=token).one()
        if w is not None:
            res['session'] = session
            res['history'] = []
            for wc in WorldCommand.query.filter_by(world_id=w.id, session=session):
                res['history'].append( {
                                        'step': wc.step, 
                                        'command': wc.command, 
                                        'args': "" if wc.args is None else wc.args,
                                        'host': wc.host,
                                        'time': str(wc.time)
                                    } 
                                )
        res["current_world"] = make_info(w)
        return res


@worlds_api.route("/create/<string:auth_token>")
class CreateWorldClass(Resource):

    @worlds_api.expect(create_world_request)
    @worlds_api.marshal_with(create_world_response, skip_none=True)
    @worlds_answer
    def post(self, auth_token):
        if (auth_token == config['security']['admin_pass']):
            print(f"Payload: {worlds_api.payload}")
            w = World()
            w.direction = "NESW"
            w.name = worlds_api.payload['name']
            w.pos_x = 1 if worlds_api.payload['start_x'] == None else worlds_api.payload['start_x']
            w.pos_y = 1 if worlds_api.payload['start_y'] == None else worlds_api.payload['start_y']
            w.token = str(uuid.uuid4())
            w.step = 0
            w.session = 'Initial'

            #############
            db_save(w)
            #############

            register_step(w, "created")

            for field in worlds_api.payload['fields']:
                wf = WorldField(world_id = w.id)
                wf.x = field['x']
                wf.y = field['y']
                wf.type = field['type']

                #############
                db_save(wf)
                #############

            return {
                "token": w.token,
                "world_info": make_info(w)
            }
        else:
            raise Exception("Invalid authorization token.")

        return {}


@worlds_api.route("/structure/<string:auth_token>/<string:token>")
class GetWorldStructureClass(Resource):

    @worlds_api.marshal_with(world_response, skip_none=True)
    @worlds_answer
    def get(self, auth_token, token):
        if (auth_token == config['security']['admin_pass']):
            w = World.query.filter_by(token=token).one()

            res = {
                "world_info": make_info(w),
                "fields": []
            }

            for wf in w.fields:
                res["fields"].append({"x": wf.x, "y": wf.y, "type": wf.type, "bonus": wf.bonus})

        else:
            raise Exception("Invalid authorization token.")

        return res


@worlds_api.route("/list_worlds/<string:auth_token>")
class GetListWorldsClass(Resource):

    @worlds_api.marshal_with(world_list_response, skip_none=True)
    @worlds_answer
    def get(self, auth_token):
        if (auth_token == config['security']['admin_pass']):
            res = {
                "worlds": []
            }

            c = 0
            for w in World.query.all():
                res['worlds'].append(make_info(w))
                c += 1

            res["size"] = c

        else:
            raise Exception("Invalid authorization token.")

        return res

