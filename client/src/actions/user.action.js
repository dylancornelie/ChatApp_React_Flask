import axios from 'axios';
import { isEmpty, refreshToken, tokenIsValid } from '../utils/utils';

export const SIGN_UP_USER = 'SIGN_UP_USER';
export const SIGN_IN_USER = 'SIGN_IN_USER';
export const DISCONNECT_USER = 'DISCONNECT_USER';
export const GET_USER = 'GET_USER';
export const ACCOUNT_DATA_CHANGE = 'ACCOUNT_DATA_CHANGE';

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
            },
          });
        }
      })
      .catch((error) => {
        if (!isEmpty(error.reponse)) {
          if (error.response.status === 409)
            return dispatch({
              type: SIGN_UP_USER,
              payload: {
                signUpError: 'Login or email already used',
              },
            });
          else
            return dispatch({
              type: SIGN_UP_USER,
              payload: {
                signUpError: 'Server not responding, please try again later',
              },
            });
        }
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
            },
          });
        }
      })
      .catch((error) => {
        if (!isEmpty(error.reponse)) {
          if (error.response.status === 401)
            return dispatch({
              type: SIGN_IN_USER,
              payload: {
                signInError: 'Email or password incorrect',
              },
            });
          else
            return dispatch({
              type: SIGN_IN_USER,
              payload: {
                signInError: 'Server not responding, please try again later',
              },
            });
        }
      });
};

export const getUser = () => {
  if (!tokenIsValid()) refreshToken();
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
        if (!isEmpty(err.response)) {
          console.error('Erreur getUser action');
        }
      });
  };
};

export const disconnectUser = () => {
  if (!tokenIsValid()) refreshToken();
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
        if (!isEmpty(err.response)) {
          console.error('Erreur logout action');
        }
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
      .catch((err) => console.log(err));
};
