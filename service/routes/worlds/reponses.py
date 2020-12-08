from flask_restx import fields
from instance.flask_app import api

world_info = api.model(
    "WorldInfo",
    {
        "name": fields.String,
        "current_x": fields.Integer,
        "current_y": fields.Integer,
        "current_session": fields.String,
        "direction": fields.String,
        "step": fields.Integer,
        "field_type": fields.String,
        "filed_bonus": fields.String
    }
)

world_info_response = api.model(
    "WorldInfoResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(world_info)
    }
)