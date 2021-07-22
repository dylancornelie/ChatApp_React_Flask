"""Config settings for for development, testing and production environments."""

import os

# uncomment the line below for postgres database url from environment variable
# postgres_local_base = os.getenv['DATABASE_URL']

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_secret_key')
    DEBUG = False
    ERROR_404_HELP = False
    RESTX_MASK_SWAGGER=False
    TOKEN_EXPIRE_HOURS = int (os.getenv('TOKEN_EXPIRE_HOURS', '0'))
    TOKEN_EXPIRE_MINUTES = int (os.getenv('TOKEN_EXPIRE_MINUTES', '0'))


class DevelopmentConfig(Config):
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../../flask_chat_main.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TOKEN_EXPIRE_MINUTES = int (os.getenv('TOKEN_EXPIRE_MINUTES', '10'))


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../../flask_chat_test.db')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False
    # uncomment the line below to use postgres
    # SQLALCHEMY_DATABASE_URI = postgres_local_base
    TOKEN_EXPIRE_HOURS = int(os.getenv('TOKEN_EXPIRE_HOURS', '24'))


config_by_name = dict(
    development=DevelopmentConfig,
    production=ProductionConfig,
    test=TestingConfig,
)
