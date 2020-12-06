import json
from flask import request
from flask_restx import Resource, fields

# local imports
from core.models import World
import misc.constants as cn
from instance.flask_app import api
from misc.response_generator import response_generator
from misc.service_logger import serviceLogger as logger
from namespace import worlds_api
from misc.db_misc_functions import db_save

world_command = api.model(
    "Command",
    {
        "name": fields.String,
        "value": fields.String,
    },
)

world_response = api.model(
    "CommandResponse",
    {
        "name": fields.String,
        "value": fields.String,
        "state": fields.String,
        "location_type": fields.String,
    },
)


# product_display_model = api.model("products",
#                                    {
#                                      "product_name": fields.String(
#                                          required=True,
#                                          description="product name"
#                                      ),
#                                      "product_type": fields.String(
#                                          required=True,
#                                          description="product type"
#                                      )
#                                    })

parser = api.parser()
#products_post = parser.copy()

#products_post.add_argument('product_name', type=str, required=True, help='product name', location='json')
#products_post.add_argument('product_type', type=str, required=True, help='product type', location='json')


@api.route("/<string:token>")
class WorldClass(Resource):
    def get(self, token):
        return {"status": f"It's ok. Token: {token}"}

    @api.expect(world_command)
    @api.marshal_with(world_response)
    def post(self, token):
        print(f"{api.payload}")
        return {"name": api.payload["name"], "state": "zupa"}


@api.route("/<string:token>")
class MoveClass(Resource):
    def get(self, token):
        return {"status": "ok", "type": f"grass"}


@api.route("/explore/<string:token>")
class ExploreClass(Resource):
    def get(self, token):
        return {"status": "ok", "type": f"grass"}


@api.route("/locationinfo/<string:token>")
class LocationInfoClass(Resource):
    def get(self, token):
        return {"type": f"box"}


@api.route("/rotate/<string:token>/<string:direction>")
class RotateClass(Resource):
    def get(self, token, direction):
        return {"status": f"Ok"}

    @api.expect(world_command)
    @api.marshal_with(world_response)
    def post(self, token):
        print(f"{api.payload}")
        return {"name": api.payload["name"], "state": "zupa"}



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