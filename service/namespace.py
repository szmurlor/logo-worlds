# namespaces

from instance.flask_app import api

worlds_api = api.namespace('worlds', description='Logo Worlds Simulator')
