
from instance.flask_app import db

class World(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False)
    token = db.Column(db.String(120), unique=False)

    def __init__(self,id, name, token):
        self.id = id
        self.name = name
        self.token = token

    def __repr__(self):
        return '{"id": "%s", "Name":"%s","Token":"%s"}' % (self.id, self.name, self.token)
