# Server

## Install library

`pip install -r requirements.txt`

## Start server

- Set environment:
    - Bask: `export FLASK_ENV=development`
    - CMD: `set FLASK_ENV=development`
    - Powershell: `$env:FLASK_ENV = "development"`
- Execute: `flask run`
- Initial database: `flask db init`
- Generate an initial migration: `flask db migrate -m "Initial migration."`
- Migration: `flask db upgrade`

# Server email

- Flask-Mailman [here](https://www.waynerv.com/flask-mailman/)

# Notification

## SSE - Client

### Registered

````js
const sse = new EventSource('/api/v1/users/stream/<token>');

sse.addEventListener(event, (event) => {
    console.log(JSON.parse(event.data))
})
````

### Notify

1. Channel
    - open
    ````js
    eventSource.addEventListener('open', () => console.log('connected'));
      ````
    - error
    ````js
    eventSource.addEventListener('error', event => {
      console.log(event);
      if (eventSource.readyState === EventSource.CLOSED) {
        /* Traitement en cas de perte de connexion définitive avec le serveur */
      }
      if (eventSource.readyState === EventSource.CONNECTING) {
        /* En cas de perte de connexion temporaire avec le serveur */
      }
    });
    ````
    - action_project
    ````js
    sse.addEventListener('action_project', (event) => {
        console.log(JSON.parse(event.data))
    })
    ````

1. Data of the event `action_project`
    1. Schema
        ````typescript
        type object = {
          type: string;
          message: string;
          data?: object;
        };
        ````
    1. Type:
        - add_into_project:
            - _You was added into the project '{project.title}'._ => schema of project item
            - _The new participant '@{user.username}' was added into the project '{project.title}'._ => schema of user
        - delete_project:
            - message: _The project '{older_project_title}' was removed by '@{owner.username}'._ => No have data
        - edit_project:
            - _The title's project '{older_project_title}' become the new tilte '{project.title}'._ =>
              data: `{project_title: new_title}`
            - _'@{current_user.username}' left the project'{project.title}'._ => data: `{user_id: user_left_id}`
            - _You was designated new coach in the project '{project.title}'._ => No data
            - _'@{user.username}' was designated new coach in the project '{project.title}'._ =>
              data: `{user_id: new_coach_id}`
            - _You was withdrew from coach in the project '{project.title}'._ => No data
            - _'@{user.username}' was withdrew from coach, he will be a participant the project'{project.title}'._ =>
              data: `{user_id: older_coach_id}`
            - _You was removed in the project '{project.title}'._ => No data
            - _'@{participant.username}' was removed in the project '{project.title}'._ =>
              data: `{user_id: older_participant_id}`

# SocketIo

## Install

`yarn add socket.io-client`

## Connect

````js
const socket = socketIOClient('/ws/messages', {
    extraHeaders: {
        Authorization: "Bearer authorization_token_here"
    }
});
socket.on('connect', function () {
    console.log('connect')
});
socket.on('connect_error', function (e) {
    console.log("connect_error")
    console.log(e)
});
````

## Error

````js
socket.on('error', function (e) {
    console.log("error")
    console.log(e)
});
````

## Join/Leave the project

When the member goes into(out) the meeting, he must joins(leaves) the project

````js
socket.emit('join_project', {project_id: int});
socket.emit('leave_project', {project_id: int});
````

## Send/Recive message in the project

- `content` or `file_name && file_base64` must be required
- `file_name` has extensions: txt, pdf, png, jpg, jpeg, gif, doc

````js
socket.emit('send_message', {
    'project_id': int,
    'sender_id': int,
    'content': str,
    'file_name': str,
    'file_base64': str,
    'receiver_id': int / null
});
socket.on('receive_message', function (data) {
    console.log(data)
});
````

Use `FileReader` to get file in client

````js
var selectedFile;
const changeHandler = (event) => {
    selectedFile(event.target.files[0]);
};

const handleSubmission = () => {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile)
    fileReader.onload = () => {
        var arrayBuffer = fileReader.result;
        socket.emit('send_message', {
            'project_id': 5,
            'sender_id': 1,
            'file_name': selectedFile.name,
            'file_base64': arrayBuffer
        })
    }
}
````

- Schema receive message

````js
{
    content: str
    file_name: str
    file_base64: str
    created_at: str // "08/06/2021, 22:58"
    id: int
    sender: {
        email: str
        first_name: str
        id: int
        last_name: str
        username: str
    }
    receiver: null | {
        email: str,
        first_name: str,
        id: int,
        last_name: str,
        username: str,
    }
}
````