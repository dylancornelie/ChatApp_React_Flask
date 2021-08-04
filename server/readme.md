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
          - _The title's project '{older_project_title}' become the new tilte '{project.title}'._ => data: `{project_title: new_title}`
          - _'@{current_user.username}' left the project'{project.title}'._ => data: `{user_id: user_left_id}`
          - _You was designated new coach in the project '{project.title}'._ => No data
          - _'@{user.username}' was designated new coach in the project '{project.title}'._ => data: `{user_id: new_coach_id}`
          - _You was withdrew from coach in the project '{project.title}'._ => No data
          - _'@{user.username}' was withdrew from coach, he will be a participant the project'{project.title}'._ => data: `{user_id: older_coach_id}`
          - _You was removed in the project '{project.title}'._ => No data
          - _'@{participant.username}' was removed in the project '{project.title}'._ => data: `{user_id: older_participant_id}`