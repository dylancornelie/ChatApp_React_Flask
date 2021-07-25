import React, { useState } from 'react';
import { useHistory } from 'react-router';
import {  useSelector } from 'react-redux';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';
import axios from 'axios';
import { refreshToken, tokenIsValid } from '../utils/utils';

const ChangePassword = () => {
  const history = useHistory();
  const userStates = useSelector((state) => state.userReducer);
  const [password, setPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log('saviing new password...');
    if (!tokenIsValid) refreshToken();
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API_URL}/api/v1/users/me/reset-password`,

      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        older_password: password,
        new_password: newPassword,
      },
    })
      .then((response) => {
        console.log('password successfully changed');
        history.push('/home');
      })
      .catch((err) => console.error(err));
  };

  const leftIconAction = () => {
    history.push('/account');
  };

  return (
    <>
      <HeaderWithArrow title={'My account'} leftIconAction={leftIconAction} />
      <div className='signin-page'>
        <Banner title='Manage your account' />
        <form className='signin-form-container' onSubmit={handleChangePassword}>
          <input
            type='password'
            required
            placeholder='old password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type='password'
            required
            placeholder='repeat new password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type='password'
            required
            placeholder='new password'
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
          />
          <button>Apply changes</button>
          <p className='signin-form-infobox'>
            {userStates.changePasswordError}
          </p>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
