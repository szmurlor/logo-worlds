
from instance.flask_app import db

class World(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False)
    token = db.Column(db.String(120), unique=False)
    pos_x = db.Column(db.Integer, unique=False)
    pos_y = db.Column(db.Integer, unique=False)
    direction = db.Column(db.String(2), unique=False)
    width = db.Column(db.Integer, unique=False)
    height = db.Column(db.Integer, unique=False)
    last_accessed_host = db.Column(db.String(255), unique=False)
    last_accessed_time = db.Column(db.DateTime, unique=False)

    def __init__(self,name=None, token=None):
        self.name = name
        self.token = token
        self.pos_x = 0
        self.pos_y = 0
        self.direction = "N"
        self.width = 0
        self.height = 0
        self.width = 0

    def __repr__(self):
        return '{"id": "%s", "Name":"%s","Token":"%s"}' % (self.id, self.name, self.token)
