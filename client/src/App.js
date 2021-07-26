import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './actions/user.action';
import Routes from './components/routes/Routes';
import { tokenIsEmpty, tokenIsValid } from './utils/utils';

const App = () => {
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(
      'Next token in : ',
      Math.floor(
        Math.max(
          0,
          (localStorage.getItem('tokenExpiration') - (Date.now() / 1000 + 60)) *
            1000
        ) / 60000
      ),
      ' minute(s)'
    );

    if (!tokenIsEmpty() && tokenIsValid()) {
      setTimeout(() => {
        dispatch(refreshToken());
      }, Math.floor(Math.max(0, (localStorage.getItem('tokenExpiration') - (Date.now() / 1000 + 60)) * 1000)));
    } else if (!tokenIsValid()) {
      localStorage.clear();
      console.log('token invalid...');
    }
  }, [userStates.token, dispatch]);

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
