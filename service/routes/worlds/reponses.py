from flask_restx import fields
from instance.flask_app import api

field_info = api.model(
    "FieldInfo", 
    {
        "x": fields.Integer,
        "y": fields.Integer,
        "type": fields.String
    }
)

create_world_request = api.model(
    "CreateWorldRequest",
    {
        "name": fields.String,
        "start_x": fields.Integer,
        "start_y": fields.Integer,
        "fields": fields.List(
            fields.Nested(field_info)
        )
    }
)

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
        "field_bonus": fields.String
    }
)

create_world = api.model(
    "CreateWorld",
    {
        "token": fields.String,
        "world_info": fields.Nested(world_info)
    }
)


create_world_response = api.model(
    "CreateWorldResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(create_world)
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


explore = api.model(
    "Explore",
    {
        "list": fields.List(fields.Nested(field_info)
        )
    }
)

explore_response = api.model(
    "ExploreResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(explore)
    }
)


move = api.model(
    "Move",
    {
        "name": fields.String,
        "current_x": fields.Integer,
        "current_y": fields.Integer,
        "current_session": fields.String,
        "direction": fields.String,
        "step": fields.Integer,
        "field_type": fields.String,
        "field_bonus": fields.String
    }
)

move_response = api.model(
    "MoveResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(move)
    }
)


rotate_response = api.model(
    "RotateResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(world_info)
    }
)

history_item = api.model(
    "HistoryItem",
    {
        "step": fields.Integer,
        "command": fields.String,
        "args": fields.String,
        "host": fields.String,
        "time": fields.String
      }
)

history = api.model(
    "History", 
    {
        "session": fields.String,
        "history": fields.List(fields.Nested(history_item)),
        "current_world": fields.Nested(world_info)
    }
)

history_response = api.model(
    "HistoryResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(history)
    }
)

world_sessions = api.model(
    "WorldSessions", 
    {
        "sessions": fields.List(fields.String),
        "world_info": fields.Nested(world_info)
    }
)

world_sessions_response = api.model(
    "WorldSessionsResponse", 
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(world_sessions)
    }
)



world = api.model(
    "World",
    {
        "world_info": fields.Nested(world_info, skip_none=True),
        "fields": fields.List(
                        fields.Nested(field_info, skip_none=True)
                        )
    }
)

world_response = api.model(
    "WorldResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(world, skip_none=True)
    }
)

world_list = api.model(
    "WorldList",
    {
        "size": fields.Integer,
        "worlds": fields.List(fields.Nested(world_info, skip_none=True))
    }
)

world_list_response = api.model(
    "WorldListResponse",
    {
        "status": fields.String, 
        "error": fields.String, 
        "payload": fields.Nested(world_list, skip_none=True)
    }
)