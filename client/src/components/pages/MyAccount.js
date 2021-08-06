import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  accountDataChange,
  disconnectUser,
  getUser,
} from '../../actions/user.action';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';

const MyAccount = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const user = userStates.user;
  const [firstName, setFirstName] = useState(userStates.user.firstName);
  const [lastName, setLastName] = useState(userStates.user.lastName);

  useEffect(() => {
    if (tokenIsEmpty()|| !tokenIsValid()) history.push('/');
    if (isEmpty(userStates.user)) dispatch(getUser());
  }, [userStates.user, dispatch, history]);

  const handleChanges = () => {
    dispatch(accountDataChange(user.email, user.login, firstName, lastName));
    history.push('/home');
  };

  const handleDisconnect = () => {
    dispatch(disconnectUser());
    history.push('/');
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
          <button onClick={handleDisconnect} className='red-button'>
            Discconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;