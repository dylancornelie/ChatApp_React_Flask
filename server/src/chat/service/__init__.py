"""Service logic for data """
from os import path
from shutil import rmtree
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


def delete_data(data) -> None:
    try:
        db.session.delete(data)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to delete your data.")


def delete_folder_and_content(path_dir: str) -> None:
    try:
        if path.isdir(path_dir):
            rmtree(path_dir)

    except OSError as e:
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to delete folder.")
