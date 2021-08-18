# pull official base image
FROM python:3.8.3-slim-buster

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat

# install dependencies
COPY requirements.txt /
RUN pip install -r /requirements.txt

# copy project
WORKDIR /server
ADD . /server

RUN flask db init \
    && flask db migrate \
    && flask db upgrade

EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]