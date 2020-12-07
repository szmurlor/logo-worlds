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
    fields = db.relationship("WorldField")

    def __init__(self, name=None, token=None):
        self.name = name
        self.token = token
        self.pos_x = 0
        self.pos_y = 0
        self.direction = "N"
        self.width = 0
        self.height = 0
        self.width = 0

    def __repr__(self):
        return '{"id": "%s", "Name":"%s","Token":"%s"}' % (
            self.id,
            self.name,
            self.token,
        )


class WorldCommand(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session = db.Column(db.String(50), unique=False)
    command = db.Column(db.String(50), unique=False)
    move_host = db.Column(db.String(255), unique=False)
    move_time = db.Column(db.DateTime, unique=False)
    world_id = db.Column(db.Integer, db.ForeignKey("world.id"))
    world = db.relationship("World")

    def __init__(self, session=None, command=None, h=None, t=None, world_id=None):
        self.session = session
        self.command = command
        self.move_host = h
        self.move_time = t
        self.world_id = world_id

    def __repr__(self):
        return '{"id": "%s", "command":"%s","session":"%s"}' % (
            self.id,
            self.command,
            self.session,
        )


class WorldField(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=False)
    bonus = db.Column(db.String(50), unique=False)
    x = db.Column(db.Integer, unique=False)
    y = db.Column(db.Integer, unique=False)
    world_id = db.Column(db.Integer, db.ForeignKey("world.id"))
    world = db.relationship("World", back_populates="fields")

    def __init__(self, type="grass", bonus=None, x=0, y=0, world_id=None):
        self.type = type
        self.bonus = bonus
        self.x = x
        self.y = y
        self.world_id = world_id

    def __repr__(self):
        return '{"id": "%s", "type":"%s","bonus":"%s", "x":%d, "y":%d}' % (
            self.id,
            self.type,
            self.bonus,
            self.x,
            self.y,
        )
