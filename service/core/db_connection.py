from sqlalchemy import create_engine
from instance.config import config


class DataBase():
    def __init__(self):
        self.engine = create_engine(config['database']['db_url'])

    def get(self):
        return self.engine.connect()
