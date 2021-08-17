import axios from 'axios';

export const JOIN_CHAT = 'JOIN_CHAT';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT';
export const DELETE_MEETING = 'DELETE_MEETING';
export const LEAVE_MEETING = 'LEAVE_MEETING';
export const DESIGNATE_COACH = 'DESIGNATE_COACH';
export const REMOVE_PRIVILEGES = 'REMOVE_PRIVILEGES';
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const FETCH_MORE_MESSAGES = 'FETCH_MORE_MESSAGES';
export const STOP_FETCH_MORE_MESSAGES = 'STOP_FETCH_MORE_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SHOW_PARTICIPANTS = 'SHOW_PARTICIPANTS';
export const SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU';
export const SHOW_ADD_PARTICIPANT = 'SHOW_ADD_PARTICIPANT';
export const SET_MESSAGE_RECEIVER = 'SET_MESSAGE_RECEIVER';
export const SCROLLED_TO_BOTTOM = 'SCROLLED_TO_BOTTOM';
export const SHOW_PREPARED_MESSAGE = 'SHOW_PREPARED_MESSAGE';
export const ADD_USER_CONNECTED = 'ADD_USER_CONNECTED';
export const REMOVE_USER_CONNECTED = 'REMOVE_USER_CONNECTED';

export const addParticipant = (meetingId, login) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/?page=1&per_page=50&filter_by=${login}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const userToAdd = response.data.data.find(
          (user) => user.username === login
        );
        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/invite`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: {
            participant: userToAdd.id,
          },
        })
          .then((response) => {
            return dispatch({
              type: ADD_PARTICIPANT,
              payload: {
                newUser: response.data,
                meetingId: meetingId,
                addByLoginError: 'User successfully added',
              },
            });
          })
          .catch((err) =>
            dispatch({
              type: ADD_PARTICIPANT,
              payload: { addByLoginError: 'User already added' },
            })
          );
      })
      .catch((err) =>
        dispatch({
          type: ADD_PARTICIPANT,
          payload: { addByLoginError: 'Invalid login' },
        })
      );
  };
};

export const removeParticipant = (meetingId, userId) => {
  return (dispatch) => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/remove-participant`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        participant: parseInt(userId),
      },
    })
      .then(() => {
        return dispatch({
          type: REMOVE_PARTICIPANT,
          payload: { userIdToRemove: userId, meetingId },
        });
      })
      .catch((err) => console.error(err));
  };
};

export const deleteMeeting = (meetingId) => {
  return (dispatch) => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        return dispatch({ type: DELETE_MEETING, payload: { meetingId } });
      })
      .catch((err) => console.error(err));
  };
};

export const leaveMeeting = (meetingId) => {
  return (dispatch) => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/leave`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        return dispatch({ type: LEAVE_MEETING, payload: { meetingId } });
      })
      .catch((err) => console.error(err));
  };
};

export const joinChat = (meeting) => ({
  type: JOIN_CHAT,
  payload: { meeting },
});

export const designateCoach = (meetingId, user) => {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/designate-coach`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        coach: user.id,
      },
    })
      .then(() => {
        return dispatch({
          type: DESIGNATE_COACH,
          payload: { meetingId, newCoach: user },
        });
      })
      .catch((err) => console.error(err));
  };
};

export const removePrivileges = (meetingId, user) => {
  return (dispatch) => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/designate-coach`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        coach: user.id,
      },
    })
      .then(() => {
        return dispatch({
          type: REMOVE_PRIVILEGES,
          payload: { meetingId, oldCoach: user },
        });
      })
      .catch((err) => console.error(err));
  };
};

export const fetchMessages = (meetingId) => {
  return (dispatch) =>
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/messages/${meetingId}?page=1&per_page=30`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) =>
        dispatch({ type: FETCH_MESSAGES, payload: { data: response.data } })
      )
      .catch((err) => console.error(err));
};

export const sendMessage = (message) => {
  return { type: SEND_MESSAGE, payload: { message } };
};

export const showParticipants = () => ({ type: SHOW_PARTICIPANTS });

export const showContextMenu = (user, isCoach) => ({
  type: SHOW_CONTEXT_MENU,
  payload: { targetedUser: user, targetedUserIsCoach: isCoach },
});

export const showAddParticipant = () => ({ type: SHOW_ADD_PARTICIPANT });

export const setMessageReceiver = (receiver) => ({
  type: SET_MESSAGE_RECEIVER,
  payload: { receiver },
});

export const scrolledToBottom = () => ({ type: SCROLLED_TO_BOTTOM });

export const showPreparedMessage = () => ({ type: SHOW_PREPARED_MESSAGE });

export const fetchMoreMessages = (urlToNext) => {
  return (dispatch) =>
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}${urlToNext}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) =>
        dispatch({
          type: FETCH_MORE_MESSAGES,
          payload: { data: response.data },
        })
      )
      .catch((err) => console.error(err));
};

export const stopFetchMoreMessage = () => ({ type: STOP_FETCH_MORE_MESSAGES });

export const addUserConnected = (userId) => ({type:ADD_USER_CONNECTED, payload:{userId:[...userId]}})

export const removeUserConnected = (userId) => ({type:REMOVE_USER_CONNECTED, payload:{userId}})