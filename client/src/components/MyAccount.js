import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  accountDataChange,
  disconnectUser,
  getUser,
} from '../actions/user.action';
import { isEmpty, tokenIsSet, tokenIsValid } from '../utils/utils';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';

const MyAccount = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const user = userStates.user;

  useEffect(() => {
    if (isEmpty(userStates.user) && tokenIsSet()) dispatch(getUser());
    else if (!tokenIsSet()) history.push('/');
  });

  const handleChanges = () => {
    console.log('saviing account changes...');
    dispatch(accountDataChange(user.email, user.login, firstName, lastName));
    history.push('/home');
  };

  const handleDisconnect = () => {
    console.log('disconnection...');
    dispatch(disconnectUser());
    history.push('/');
  };

  const leftIconAction = () => {
    history.push('/home');
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useState(() => {
    if (!tokenIsValid()) history.push('/');
    else if (isEmpty(userStates.user)) {
      dispatch(getUser());
    }
  });

  return (
    <>
      <HeaderWithArrow title={'My account'} leftIconAction={leftIconAction} />
      <div className='signin-page'>
        <Banner title='Manage your account' />
        <div className='signin-form-container'>
          <input
            type='text'
            required
            placeholder='first name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
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
          <button onClick={handleDisconnect} className='red-button'>
            Discconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
