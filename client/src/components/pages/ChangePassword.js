import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {  useSelector } from 'react-redux';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';
import axios from 'axios';
import { tokenIsEmpty, tokenIsValid } from '../../utils/utils';

const ChangePassword = () => {
  const userStates = useSelector((state) => state.userReducer);
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(()=> {
    if (tokenIsEmpty()|| !tokenIsValid()) history.push('/');
  })

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log('TO DO VERIFICATION PASSWORD')
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
      .then(() => {

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
          type='email'
          autoComplete='email'
          value={userStates.user.email}
          readOnly
          hidden          
        />
          <input
            type='password'
            required
            placeholder='old password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type='password'
            required
            placeholder='repeat new password'
            autoComplete='new-password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type='password'
            required
            placeholder='new password'
            autoComplete='new-password'
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
