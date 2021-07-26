import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './actions/user.action';
import Routes from './components/routes/Routes';
import { tokenIsEmpty, tokenIsValid } from './utils/utils';

const App = () => {
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tokenIsEmpty() && tokenIsValid()) {
      console.log(
        'Next token in : ',
        Math.ceil(
          Math.max(
            0,
            (localStorage.getItem('tokenExpiration') -
              (Date.now() / 1000 + 60)) *
              1000
          ) / 60000
        ),
        ' minute(s)'
      );
      setTimeout(() => {
        if (!tokenIsEmpty() && tokenIsValid()) dispatch(refreshToken());
      }, Math.floor(Math.max(0, (localStorage.getItem('tokenExpiration') - (Date.now() / 1000 + 30)) * 1000)));
    } else if (!tokenIsValid()) {
      localStorage.clear();
      console.log('no valid token');
    }
  }, [userStates.token, dispatch]);

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
