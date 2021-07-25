import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Banner from './utils/Banner';
import { signInUser } from '../actions/user.action';
import { tokenIsSet } from '../utils/utils';

const SignIn = () => {
  const history = useHistory();
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (tokenIsSet()) history.push('/home');
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log('signing in...');
    dispatch(signInUser(email, password));
    if (tokenIsSet()) history.push('/home');
  };

  return (
    <div className='signin-page'>
      <Banner title='Sign in into your account' />
      <form className='signin-form-container' onSubmit={handleSignIn}>
        <input
          type='text'
          autoComplete='email'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          autoComplete='current-password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Log In</button>
        <p className='signin-form-infobox'>{userStates.signInError}</p>
      </form>
      <div className='signin-form-bottom-link'>
        <p>Forgot password</p>
        <Link to='/signup'>Create an account</Link>
      </div>
    </div>
  );
};

export default SignIn;
