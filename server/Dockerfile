FROM python:3.8-slim

WORKDIR /server

ADD ./requirements.txt /server/requirements.txt

RUN pip install -r requirements.txt

ADD . /server

RUN export FLASK_APP=app.py \
    && rm -rf migrations \
    && flask db init \
    && flask db migrate \
    && flask db upgrade

EXPOSE 5000 6379
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]