"""Logic for """

import json
from collections import OrderedDict

from flask import stream_with_context, Response, current_app

from src.chat import redis


class Message(object):
    """
    Data that is published as a server-sent event.
    """

    def __init__(self, data, type=None, id=None, retry=None):
        """
        Create a server-sent event.
        :param data: The event data. If it is not a string, it will be
            serialized to JSON using the Flask application's
            :class:`~flask.json.JSONEncoder`.
        :param type: An optional event type.
        :param id: An optional event ID.
        :param retry: An optional integer, to specify the reconnect time for
            disconnected clients of this stream.
        """
        self.data = data
        self.type = type
        self.id = id
        self.retry = retry

    def to_dict(self):
        """
        Serialize this object to a minimal dictionary, for storing in Redis.
        """
        # data is required, all others are optional
        d = {"data": self.data}
        if self.type:
            d["type"] = self.type
        if self.id:
            d["id"] = self.id
        if self.retry:
            d["retry"] = self.retry
        return d

    def __str__(self):
        """
        Serialize this object to a string, according to the `server-sent events specification`.
        """
        data = json.dumps(self.data)
        lines = ["data:{value}".format(value=line) for line in data.splitlines()]
        if self.type:
            lines.insert(0, "event:{value}".format(value=self.type))
        if self.id:
            lines.append("id:{value}".format(value=self.id))
        if self.retry:
            lines.append("retry:{value}".format(value=self.retry))
        return "\n".join(lines) + "\n\n"

    def __repr__(self):
        kwargs = OrderedDict()
        if self.type:
            kwargs["type"] = self.type
        if self.id:
            kwargs["id"] = self.id
        if self.retry:
            kwargs["retry"] = self.retry
        kwargs_repr = "".join(
            ", {key}={value!r}".format(key=key, value=value)
            for key, value in kwargs.items()
        )
        return "{classname}({data!r}{kwargs})".format(
            classname=self.__class__.__name__,
            data=self.data,
            kwargs=kwargs_repr,
        )

    def __eq__(self, other):
        return (
                isinstance(other, self.__class__) and
                self.data == other.data and
                self.type == other.type and
                self.id == other.id and
                self.retry == other.retry
        )


def publish(channel: str, data, type: str = None, id: int = None, retry: int = None) -> None:
    """
    Publish data as a server-sent event.

    :param data: The event data. If it is not a string, it will be
        serialized to JSON using the Flask application's.
    :param type: An optional event type.
    :param id: An optional event ID.
    :param retry: An optional integer, to specify the reconnect time for
        disconnected clients of this stream.
    :param channel: If you want to direct different events to different
        clients, you may specify a channel for this event to go to.
        Only clients listening to the same channel will receive this event.
        Defaults to "sse".
    """
    # If channel exist, we will send notification
    channel_sse = f'sse:{channel}'
    if redis.get(channel_sse):
        message = Message(data, type=type, id=id, retry=retry)
        msg_json = json.dumps(message.to_dict())
        redis.publish(channel_sse, msg_json)


def messages(channel: str = 'sse'):
    """
        A generator objects from the given channel.
    """
    pubsub = redis.pubsub()
    pubsub.subscribe(channel)

    # Mark existence channel
    redis.set(channel, 1)

    try:
        for pubsub_message in pubsub.listen():
            if pubsub_message['type'] == 'message':
                msg_dict = json.loads(pubsub_message['data'])
                yield Message(**msg_dict)
    finally:
        try:
            pubsub.unsubscribe(channel)

            # Delete the mark when finish
            redis.delete(channel)

        except ConnectionError as e:
            current_app.logger.error(str(e), exc_info=True)


def stream(channel: str = 'sse'):
    """
    A view function that streams server-sent events.
    """
    channel_sse = f'sse:{channel}'

    @stream_with_context
    def generator():
        for message in messages(channel=channel_sse):
            yield str(message)

    return Response(
        generator(),
        mimetype='text/event-stream',
    )
