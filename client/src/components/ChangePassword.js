import React, { useState } from 'react';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';
import { useHistory } from 'react-router';

const ChangePassword = () => {
  const history = useHistory();

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log('saviing...');
  };

  const leftIconAction = () => {
    history.push('/account');
  };

  const [password, setPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
