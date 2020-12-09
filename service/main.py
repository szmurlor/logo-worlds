from instance.config import config
from instance.flask_app import app
from misc.service_logger import serviceLogger as logger

if __name__ == '__main__':
    logger.info("Log Worlds service started at {}:{}".format(config['host_service']['host'],
                                                  config['host_service']['port']
                                                  ))

    app.run(host=config['host_service']['host'],
            port=int(config['host_service']['port']),
            threaded=config['host_service'].as_bool('threaded'),
            debug=config['host_service'].as_bool('debug')
            )
