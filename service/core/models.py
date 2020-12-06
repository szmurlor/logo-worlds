from instance.flask_app import db

class World(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    token = db.Column(db.String(120), unique=True)

    def __init__(self,name, token):
        self.name = name
        self.token = token

    def __repr__(self):
        return '{"Name":"%s","Token":"%s"}' % (self.name, self.token)
