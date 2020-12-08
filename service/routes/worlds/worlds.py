import json
import functools
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



@api.route("/info/<string:token>")
class WorldClass(Resource):
    @api.marshal_with(world_info_response)
    @worlds_answer
    def get(self, token):
        res = {}
        w = World.query.filter_by(token=token).one()

        if (w is not None):
            register_step(w, 'info')
            make_info(res, w)
        else:
            raise Exception( f"Unable to find world with token: '{token}'" )

        return res

    # @api.expect(world_command)
    # @api.marshal_with(world_response)
    # def post(self, token):
    #     print(f"{api.payload}")
    #     return {"name": api.payload["name"], "state": "zupa"}


@api.route("/move/<string:token>")
class MoveClass(Resource):
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
    
        make_info(res, w)
        return res


@api.route("/explore/<string:token>")
class ExploreClass(Resource):

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


@api.route("/rotate/<string:token>/<string:direction>")
class RotateClass(Resource):

    @worlds_answer
    def get(self, token, direction):
        res = {}
        w = World.query.filter_by(token=token).one()
        if w is not None:
            register_step(w, 'rotate', direction)
            rotate(w, direction)
        
        make_info(res, w)
        return res

    # @api.expect(world_command)
    # @api.marshal_with(world_response)
    # def post(self, token):
    #     print(f"{api.payload}")
    #     return {"name": api.payload["name"], "state": "zupa"}

@api.route("/history/<string:token>/<string:session>")
class RotateClass(Resource):

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
        res["current_world"] = {}
        make_info(res["current_world"], w)
        return res

# @prod_api.route("/ProductInfo")
# class ProductsInfo(Resource):
#     def get(self):
#         """
#         GET request endpoint of ProductsInfo
#         :return:
#             "Hello world, from Products!"
#         """
#         logger.info("testing accessibility of products endpoint")
#         return "Hello world, from Products!"

#     @prod_api.expect(product_display_model, validate=True)
#     def post(self):
#         """
#         add products and product details.
#         :return:
#             {"payload" : "Product details added successfully."}
#         """
#         try:
#             data = request.data
#             if type(data) == bytes:
#                 data = data.decode('utf-8')

#             data = json.loads(data)

#             product_name = str(data['product_name'])
#             product_type = float(data['product_type'])

#             new_product = Products(product_name=product_name, product_type=product_type)

#             db_save(new_product)
#             logger.info(cn.PRODUCT_ADDED_SUCC)
#             return response_generator(cn.PRODUCT_ADDED_SUCC, status=201)

#         except Exception as e:
#             logger.error(cn.INTERNAL_SERV_ERR, exc_info=True)
#             return response_generator(cn.INTERNAL_SERV_ERR, status=500)

#     @prod_api.doc(False)
#     def put(self):
#         """
#         PUT request endpoint of ProductsInfo
#         """
#         api.abbort(403)

#     @prod_api.doc(False)
#     def delete(self):
#         """
#         DELETE request endpoint of ProductsInfo
#         """
#         api.abbort(403)