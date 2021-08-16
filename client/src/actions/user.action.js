import axios from 'axios';
import { emailIsValid, passwordIsValid } from '../utils/utils';

export const SIGN_UP_USER = 'SIGN_UP_USER';
export const SIGN_IN_USER = 'SIGN_IN_USER';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const DISCONNECT_USER = 'DISCONNECT_USER';
export const GET_USER = 'GET_USER';
export const ACCOUNT_DATA_CHANGE = 'ACCOUNT_DATA_CHANGE';
export const CREATE_MEETING = 'CREATE_MEETING';
export const GET_MEETINGS = 'GET_MEETINGS';
export const REFRESH_MEETINGS = 'REFRESH_MEETINGS';
export const CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR';

export const signUpUser = (
  email,
  login,
  password,
  repeatPassword,
  firstName,
  lastName
) => {
  if (repeatPassword !== password)
    return {
      type: SIGN_UP_USER,
      payload: {
        signUpError: 'Passwords do not match',
      },
    };

  if (!passwordIsValid(password))
    return {
      type: SIGN_UP_USER,
      payload: {
        signUpError:
          'Password must at least contains 8 characters, 1 uppercase, 1 lowercase & 1 digit',
      },
    };

  if (!emailIsValid(email))
    return {
      type: SIGN_UP_USER,
      payload: {
        signUpError: 'Invalid mail address',
      },
    };

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
        localStorage.clear();
        localStorage.setItem('token', response.data.authorization);
        localStorage.setItem(
          'tokenExpiration',
          Math.floor(Date.now() / 1000) + response.data.token_expires_in
        );
        dispatch({
          type: SIGN_IN_USER,
          payload: {
            signInError: 'Logged in successfully',
            token: response.data.authorization,
          },
        });
      })
      .catch(() => {
        dispatch({
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
        localStorage.clear();
        localStorage.setItem('token', response.data.authorization);
        localStorage.setItem(
          'tokenExpiration',
          Math.floor(Date.now() / 1000) + response.data.token_expires_in
        );
        console.log('refreshing token...');
        dispatch({
          type: REFRESH_TOKEN,
          payload: { token: response.data.authorization },
        });
      })
      .catch((err) => {
        console.err(err);
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
      .then((response) =>
        dispatch({ type: GET_USER, payload: { user: response.data } })
      )
      .catch((err) => console.error(err));
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
        localStorage.clear();
        dispatch({ type: DISCONNECT_USER });
      })
      .catch((err) => console.error(err));
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
      .then((response) =>
        dispatch({
          type: ACCOUNT_DATA_CHANGE,
          payload: { firstName, lastName },
        })
      )
      .catch((err) => console.error(err));
};

export const createMeeting = (title) => {
  return (dispatch) => {
    console.log('create meeting response...', title);
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
      .catch((err) => {
        dispatch({
          type: CREATE_MEETING,
          payload: {
            createMeetingError: 'Meeting name already used',
            newMeeting: {},
          },
        });
      });
  };
};

export const getMeetings = () => {
  return async (dispatch) => {
    try {
      let response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/api/v1/projects/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let fetchMore = response.data.has_next;
      let nextLink = response.data.next;
      let meetings = response.data.data;
      while (fetchMore) {
        response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL}${nextLink}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchMore = response.data.has_next;
        nextLink = response.data.next;
        meetings = [...meetings, ...response.data.data];
      }
      return dispatch({
        type: GET_MEETINGS,
        payload: { meetings },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const refreshMeeting = () => {
  return async (dispatch) => {
    try {
      let response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/api/v1/projects/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let fetchMore = response.data.has_next;
      let nextLink = response.data.next;
      let meetings = response.data.data;
      while (fetchMore) {
        response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL}${nextLink}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchMore = response.data.has_next;
        nextLink = response.data.next;
        meetings = [...meetings, ...response.data.data];
      }
      return dispatch({
        type: REFRESH_MEETINGS,
        payload: { meetings },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const changePasswordError = (errorMessage) => ({
  type: CHANGE_PASSWORD_ERROR,
  payload: { errorMessage },
});
