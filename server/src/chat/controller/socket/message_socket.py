from flask_socketio import Namespace, ConnectionRefusedError
from werkzeug.exceptions import Forbidden, Unauthorized

from src.chat.util.decorator import token_required


class WsMessageNamespace(Namespace):
    @token_required
    def _login(self):
        pass

    def on_connect(self):
        try:
            self._login()
        except (Forbidden, Unauthorized) as e:
            raise ConnectionRefusedError(e.description)

