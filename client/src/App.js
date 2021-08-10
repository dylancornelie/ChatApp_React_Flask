import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetings, refreshToken } from './actions/user.action';
import Routes from './components/routes/Routes';
import { tokenIsEmpty, tokenIsValid } from './utils/utils';

const App = () => {
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNotification = () => {
      const notificationSource = new EventSource(
        `${
          process.env.REACT_APP_API_URL
        }/api/v1/users/stream/${localStorage.getItem('token')}`
      );

      notificationSource.addEventListener('error', (event) =>
        console.error(event)
      );

      notificationSource.addEventListener('action_project', (event) => {
        console.log(JSON.parse(event.data));
        const data = JSON.parse(event.data);

        dispatch(getMeetings());
        new Notification(data.message, {
          icon: '../image/logo72.png',
          vibrate: [200, 100, 200],
          renotify: true,
          tag: 'txChat',
          badge: '../image/logo72.png',
          lang: 'EN',
        });
      });
    };

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

    if ('Notification' in window) {
      if (Notification.permission === 'granted' && !tokenIsEmpty()) {
        handleNotification();
      } else if (
        Notification.permission !== 'denied' ||
        Notification.permission === 'default'
      ) {
        Notification.requestPermission((permission) => {
          if (permission === 'granted' && !tokenIsEmpty()) {
            handleNotification();
          } else console.log('Notifications are disabled or you are not logged in');
        });
      }
    } else console.log('Notifications are not supported by your browser');
  }, [userStates.token, dispatch]);

  return (
    <>
      <Routes />
    </>
  );
};

export default App;
