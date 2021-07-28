"""Service logic for data """

from flask import current_app
from werkzeug.exceptions import InternalServerError

from src.chat import db


def save_data(data) -> None:
    try:
        db.session.add(data)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def insert_data(query, data) -> None:
    try:
        db.session.execute(query.insert(), data)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")
