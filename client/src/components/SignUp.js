import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from './utils/Banner';

const SignUp = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("SignUp !")
  };

  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <div className='signin-page'>
      <Banner title='Create your account' />
      <form className='signin-form-container' onSubmit={handleSignUp}>
        <div className='signup-grid-form'>
          <input
            type='text'
            required
            placeholder='email'
            value={email}
            onChange={() => setEmail()}
          />
          <input
            type='text'
            required
            placeholder='login'
            value={login}
            onChange={() => setLogin()}
          />
          <input
            type='password'
            required
            placeholder='password'
            value={password}
            onChange={() => setPassword()}
          />
          <input
            type='password'
            required
            placeholder='repeat-password'
            value={repeatPassword}
            onChange={() => setRepeatPassword()}
          />
          <input
            type='text'
            required
            placeholder='first name'
            value={firstName}
            onChange={() => setFirstName()}
          />
          <input
            type='text'
            required
            placeholder='last name'
            value={lastName}
            onChange={() => setLastName()}
          />
        </div>
        <button>Create account</button>
      </form>
      <p className='signin-form-infobox'>Error in password</p>
      <p className='signin-form-bottom-link'>
      <Link to="/">Account already exists ?</Link>

      </p>
    </div>
  );
};

export default SignUp;
