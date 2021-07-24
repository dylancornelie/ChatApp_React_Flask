import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';

const MyAccount = () => {
  const history = useHistory();

  const handleChanges = () => {
    console.log('saviing...');
  };

  const handleDisconnect = () => {
    console.log('disconnection...');
    history.push('/');
  };

  const leftIconAction = () => {
    history.push('/home');
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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
          <button
            onClick={handleDisconnect}
            className='red-button'
          >
            Discconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
