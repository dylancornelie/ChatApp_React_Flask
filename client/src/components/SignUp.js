import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Banner from './utils/Banner';
import { signUpUser } from '../actions/user.action';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleSignUp = (e) => {
    e.preventDefault();
    dispatch(
      signUpUser(email, login, password, repeatPassword, firstName, lastName)
    );
    console.log('SignUp !');
  };

  return (
    <div className='signin-page'>
      <Banner title='Create your account' />
      <form className='signin-form-container' onSubmit={handleSignUp}>
        <div className='signup-grid-form'>
          <input
            type='text'
            placeholder='email'
            value={email}
            onChange={() => setEmail()}
          />
          <input
            type='text'
            placeholder='login'
            value={login}
            onChange={() => setLogin()}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={() => setPassword()}
          />
          <input
            type='password'
            placeholder='repeat-password'
            value={repeatPassword}
            onChange={() => setRepeatPassword()}
          />
          <input
            type='text'
            placeholder='first name'
            value={firstName}
            onChange={() => setFirstName()}
          />
          <input
            type='text'
            placeholder='last name'
            value={lastName}
            onChange={() => setLastName()}
          />
        </div>
        <button>Create account</button>
      </form>
      <p className='signin-form-infobox'>{userStates.signUpError}</p>
      <p className='signin-form-bottom-link'>
        <Link to='/'>Account already exists ?</Link>
      </p>
    </div>
  );
};

export default SignUp;
