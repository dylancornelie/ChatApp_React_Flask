import axios from 'axios';
import React, { useEffect } from 'react';
import Routes from './components/routes/Routes';
import { tokenIsEmpty, tokenIsValid } from './utils/utils';

const App = () => {
  useEffect(() => {
    const refreshToken = async () => {
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
          }
        })
        .catch((err) => console.error(err));
    };

    if (!tokenIsEmpty() && tokenIsValid()) refreshToken();
    else if (!tokenIsValid()) localStorage.clear();
  });

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
