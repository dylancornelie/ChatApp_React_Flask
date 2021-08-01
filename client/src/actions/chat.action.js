import axios from 'axios';

export const JOIN_CHAT = 'JOIN_CHAT';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT';
export const DELETE_MEETING = 'DELETE_MEETING';
export const LEAVE_MEETING = 'LEAVE_MEETING';
export const SHOW_PARTICIPANTS = 'SHOW_PARTICIPANTS';
export const SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU';
export const SHOW_ADD_PARTICIPANT = 'SHOW_ADD_PARTICIPANT';
export const SET_MESSAGE_RECEIVER = 'SET_MESSAGE_RECEIVER';

export const addParticipant = (meetingId, login) => {
  console.log(login);
  return (dispatch) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/invite`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        participant: parseInt(login),
      },
    })
      .then((response) => {
        return dispatch({ type: ADD_PARTICIPANT, payload: response.data });
      })
      .catch((err) => console.error(err));
  };
};

export const removeParticipant = (meetingId, login) => {
  return (dispatch) => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/${meetingId}/remove-participant`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        participant: parseInt(login),
      },
    })
      .then((response) => {
        return dispatch({ type: REMOVE_PARTICIPANT, payload: response.data });
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
      .catch((err) => console.erro(err));
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
      .catch((err) => console.erro(err));
  };
};

export const joinChat = (meeting) => ({
  type: JOIN_CHAT,
  payload: { meeting },
});

export const showParticipants = () => ({ type: SHOW_PARTICIPANTS });
export const showContextMenu = () => ({ type: SHOW_CONTEXT_MENU });
export const showAddParticipant = () => ({ type: SHOW_ADD_PARTICIPANT });
export const setMessageReceiver = (receiver) => ({
  type: SET_MESSAGE_RECEIVER,
  payload: { receiver },
});
