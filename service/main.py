from flask import Flask, request
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy


api = Api(title="Logo Worlds API", description="Logo Worlds Simulator (c) Robert Szmurlo 2020")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.sqlite3'
api.init_app(app)

# name_space = app.namescape("main", description="Logo Worlds")

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


@api.route("/v1/world/<string:token>")
class WorldClass(Resource):
    def get(self, token):
        return {"status": f"It's ok. Token: {token}"}

    @api.expect(world_command)
    @api.marshal_with(world_response)
    def post(self, token):
        print(f"{api.payload}")
        return {"name": api.payload["name"], "state": "zupa"}


@api.route("/v1/move/<string:token>")
class MoveClass(Resource):
    def get(self, token):
        return {"status": "ok", "type": f"grass"}


@api.route("/v1/explore/<string:token>")
class ExploreClass(Resource):
    def get(self, token):
        return {"status": "ok", "type": f"grass"}


@api.route("/v1/locationinfo/<string:token>")
class LocationInfoClass(Resource):
    def get(self, token):
        return {"type": f"box"}


@api.route("/v1/rotate/<string:token>/<string:direction>")
class RotateClass(Resource):
    def get(self, token, direction):
        return {"status": f"Ok"}

    @api.expect(world_command)
    @api.marshal_with(world_response)
    def post(self, token):
        print(f"{api.payload}")
        return {"name": api.payload["name"], "state": "zupa"}
