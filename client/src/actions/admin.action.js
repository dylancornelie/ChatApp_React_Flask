import axios from 'axios';

export const ARCHIVE_USER = 'ARCHIVE_USER';
export const UNARCHIVE_USER = 'UNARCHIVE_USER';
export const PROMOTE_USER = 'PROMOTE_USER';
export const DEMOTE_USER = 'DEMOTE_USER';
export const ADMIN_ERROR = 'ADMIN_ERROR';

export const archiveUser = (login) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/?page=1&per_page=50&filter_by=${login}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const userToArchive = response.data.data.find(
          (user) => user.username === login
        );

        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/archive/${userToArchive.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            dispatch({
              type: ARCHIVE_USER,
            });
          })
          .catch((err) =>
            dispatch({
              type: ADMIN_ERROR,
              payload: { addByLoginError: 'User already archived' },
            })
          );
      })
      .catch((err) =>
        dispatch({
          type: ADMIN_ERROR,
          payload: { adminError: 'Invalid login' },
        })
      );
  };
};

export const unarchiveUser = (login) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/?page=1&per_page=50&filter_by=${login}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const userToUnarchive = response.data.data.find(
          (user) => user.username === login
        );

        axios({
          method: 'DELETE',
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/archive/${userToUnarchive.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            dispatch({
              type: ARCHIVE_USER,
            });
          })
          .catch((err) =>
            dispatch({
              type: ADMIN_ERROR,
              payload: { addByLoginError: 'User already unarchived' },
            })
          );
      })
      .catch((err) =>
        dispatch({
          type: ADMIN_ERROR,
          payload: { adminError: 'Invalid login' },
        })
      );
  };
};

export const promoteUser = (login) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/?page=1&per_page=50&filter_by=${login}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const userToUnarchive = response.data.data.find(
          (user) => user.username === login
        );

        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/admin/${userToUnarchive.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            dispatch({
              type: PROMOTE_USER,
            });
          })
          .catch((err) =>
            dispatch({
              type: ADMIN_ERROR,
              payload: { addByLoginError: 'User already promoted' },
            })
          );
      })
      .catch((err) =>
        dispatch({
          type: ADMIN_ERROR,
          payload: { adminError: 'Invalid login' },
        })
      );
  };
};

export const demoteUser = (login) => {
  return (dispatch) => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/?page=1&per_page=50&filter_by=${login}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        const userToUnarchive = response.data.data.find(
          (user) => user.username === login
        );
        axios({
          method: 'DELETE',
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/admin/${userToUnarchive.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((response) => {
            dispatch({
              type: PROMOTE_USER,
            });
          })
          .catch((err) =>
            dispatch({
              type: ADMIN_ERROR,
              payload: { addByLoginError: 'User already promoted' },
            })
          );
      })
      .catch((err) =>
        dispatch({
          type: ADMIN_ERROR,
          payload: { adminError: 'Invalid login' },
        })
      );
  };
};
