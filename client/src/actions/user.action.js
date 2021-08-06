import axios from 'axios';

export const SIGN_UP_USER = 'SIGN_UP_USER';
export const SIGN_IN_USER = 'SIGN_IN_USER';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const DISCONNECT_USER = 'DISCONNECT_USER';
export const GET_USER = 'GET_USER';
export const ACCOUNT_DATA_CHANGE = 'ACCOUNT_DATA_CHANGE';
export const CREATE_MEETING = 'CREATE_MEETING';
export const GET_MEETINGS = 'GET_MEETINGS';
export const INVITED_INTO_MEETING = 'INVITED_INTO_MEETING';

export const signUpUser = (
  email,
  login,
  password,
  repeatPassword,
  firstName,
  lastName
) => {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/`,
      data: {
        email,
        username: login,
        password,
        first_name: firstName,
        last_name: lastName,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          localStorage.clear();
          localStorage.setItem('token', response.data.authorization);
          localStorage.setItem(
            'tokenExpiration',
            Math.floor(Date.now() / 1000) + response.data.token_expires_in
          );
          return dispatch({
            type: SIGN_UP_USER,
            payload: {
              signUpError: 'Account created successfully',
              token: response.data.authorization,
            },
          });
        }
      })
      .catch(() => {
        return dispatch({
          type: SIGN_UP_USER,
          payload: {
            signUpError: 'Login or email already used',
          },
        });
      });
  };
};

export const signInUser = (email, password) => {
  return (dispatch) =>
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/auth/login`,
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          localStorage.setItem('token', response.data.authorization);
          localStorage.setItem(
            'tokenExpiration',
            Math.floor(Date.now() / 1000) + response.data.token_expires_in
          );
          return dispatch({
            type: SIGN_IN_USER,
            payload: {
              signInError: 'Logged in successfully',
              token: response.data.authorization,
            },
          });
        }
      })
      .catch(() => {
        return dispatch({
          type: SIGN_IN_USER,
          payload: {
            signInError: 'Email or password incorrect',
          },
        });
      });
};

export const refreshToken = () => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          localStorage.setItem('token', response.data.authorization);
          localStorage.setItem(
            'tokenExpiration',
            Math.floor(Date.now() / 1000) + response.data.token_expires_in
          );
          console.log('refreshing token...');
          return dispatch({
            type: REFRESH_TOKEN,
            payload: { token: response.data.authorization },
          });
        }
      })
      .catch(() => {
        localStorage.clear();
      });
  };
};

export const getUser = () => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/me`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.status === 200)
          return dispatch({ type: GET_USER, payload: { user: response.data } });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const disconnectUser = () => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/auth/logout`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          dispatch({ type: DISCONNECT_USER });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const accountDataChange = (email, login, firstName, lastName) => {
  return (dispatch) =>
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/me`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        email,
        username: login,
        first_name: firstName,
        last_name: lastName,
      },
    })
      .then((response) => {
        return dispatch({
          type: ACCOUNT_DATA_CHANGE,
          payload: response.data,
        });
      })
      .catch((err) => console.error(err));
};

export const createMeeting = (title) => {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        title,
      },
    })
      .then((response) => {
        return dispatch({
          type: CREATE_MEETING,
          payload: {
            newMeeting: response.data,
            createMeetingError: 'Meeting successfully created',
          },
        });
      })
      .catch(() =>
        dispatch({
          type: CREATE_MEETING,
          payload: {
            createMeetingError: 'Meeting name already used',
            newMeeting: {},
          },
        })
      );
  };
};

export const getMeetings = () => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/projects/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        dispatch({
          type: GET_MEETINGS,
          payload: { meetings: response.data.data },
        });
      })
      .catch((err) => console.error(err));
  };
};

export const invitedIntoMeeting = (meetingData) => {
  return { type: INVITED_INTO_MEETING, payload: { meetingData } };
};
