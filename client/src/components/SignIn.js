import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Banner from './utils/Banner';

const SignIn = () => {
  const userStates = useSelector((state) => state.userReducer);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    history.push('/home');
  };

  return (
    <div className='signin-page'>
      <Banner title='Sign in into your account' />
      <form className='signin-form-container' onSubmit={handleSignIn}>
        <input
          type='text'
          required
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          required
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log In</button>
      </form>
      <p className='signin-form-infobox'>{userStates.signInError}</p>
      <p className='signin-form-bottom-link'>
        <Link to='/signup'>Create an account</Link>
      </p>
    </div>
  );
};

export default SignIn;
