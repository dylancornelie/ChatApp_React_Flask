import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  accountDataChange,
  disconnectUser,
  getUser,
} from '../../actions/user.action';
import {
  alreadySubscribeToPushNotification,
  isEmpty,
  subscribeToPushNotification,
  supportPushNotification,
  tokenIsEmpty,
  tokenIsValid,
  unsubscribeFromPushNotification,
} from '../../utils/utils';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';

const MyAccount = () => {
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubscribeToPush, setIsSubscribeToPush] = useState(null);

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
    if (isEmpty(userStates.user)) dispatch(getUser());
    else {
      setFirstName(userStates.user.firstName);
      setLastName(userStates.user.lastName);
    }
    const asyncFunction = async () => {
      setIsSubscribeToPush(await alreadySubscribeToPushNotification());
    };
    isSubscribeToPush === null && asyncFunction();
  }, [userStates.user, dispatch, history, isSubscribeToPush]);

  const handleChanges = () => {
    dispatch(
      accountDataChange(
        userStates.user.email,
        userStates.user.login,
        firstName,
        lastName
      )
    );
    history.push('/home');
  };

  const handleDisconnect = () => {
    dispatch(disconnectUser());
    history.push('/');
  };

  const handlePushSubscription = async () => {
    if (isSubscribeToPush) {
      const success = await unsubscribeFromPushNotification();
      if (success) setIsSubscribeToPush(false);
    } else {
      const success = await subscribeToPushNotification();
      if (success) setIsSubscribeToPush(true);
    }
  };

  const leftIconAction = () => {
    history.push('/home');
  };

  return (
    <>
      <HeaderWithArrow title={'My account'} leftIconAction={leftIconAction} />
      <div className='signin-page'>
        <Banner title='Manage your account' />
        <div className='signin-form-container'>
          <p className='login-info'>{`Your login : ${userStates.user.login}`}</p>
          <label htmlFor='firstName'>First Name</label>
          <input
            id='firstName'
            type='text'
            required
            placeholder='first name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor='lastName'>Last name</label>
          <input
            id='lastName'
            type='text'
            required
            placeholder='last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button onClick={handleChanges}>Save changes</button>
          <button
            style={{ marginTop: '3rem' }}
            onClick={() => history.push('/account/password')}
          >
            Change password
          </button>
          <button
            style={{ marginTop: '3rem' }}
            onClick={() =>
              supportPushNotification() && handlePushSubscription()
            }
          >
            {!supportPushNotification()
              ? `Push notification not supported`
              : isSubscribeToPush
              ? `Unsubscribe from push notification`
              : `Subscribe to push notification`}
          </button>
          <button onClick={handleDisconnect} className='red-button'>
            Discconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
