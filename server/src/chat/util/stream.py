import json

import six
from flask import stream_with_context, Response

from src.chat import redis


class Message(object):
    """
    Data that is published as a server-sent event.
    """

    def __init__(self, data, type=None):
        """
        Create a server-sent event.
        :param data: The event data. If it is not a string, it will be
            serialized to JSON using the Flask application
        :param type: An optional event type.
        """
        self.data = data
        self.type = type

    def to_dict(self):
        """
        Serialize this object to a minimal dictionary, for storing in Redis.
        """
        # data is required, all others are optional
        d = {"data": self.data}
        if self.type:
            d["type"] = self.type
        return d

    def __str__(self):
        """
        Serialize this object to a string, according to the `server-sent events
        specification <https://www.w3.org/TR/eventsource/>`_.
        """
        if isinstance(self.data, six.string_types):
            data = self.data
        else:
            data = json.dumps(self.data)
        lines = ["data:{value}".format(value=line) for line in data.splitlines()]
        if self.type:
            lines.insert(0, "event:{value}".format(value=self.type))
        return "\n".join(lines) + "\n\n"

    def __eq__(self, other):
        return (
                isinstance(other, self.__class__) and
                self.data == other.data and
                self.type == other.type
        )


def publish(channel: str, data, type: str = None):
    message = Message(data, type=type)
    msg_json = json.dumps(message.to_dict())
    redis.publish(channel, msg_json)


def messages(channel: str):
    pubsub = redis.pubsub()
    pubsub.subscribe(channel)
    try:
        for pubsub_message in pubsub.listen():
            if pubsub_message['type'] == 'message':
                msg_dict = json.loads(pubsub_message['data'])
                yield Message(**msg_dict)
    finally:
        try:
            pubsub.unsubscribe(channel)
        except ConnectionError:
            pass


def stream(channel: str):
    @stream_with_context
    def generator():
        for message in messages(channel=channel):
            yield str(message)

    return Response(
        generator(),
        mimetype='text/event-stream',
    )
