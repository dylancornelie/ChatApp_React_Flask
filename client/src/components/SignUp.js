import React, { useState } from 'react';
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
    <main className='signin-page'>
      <Banner title='Create your account' />
      <form className='signin-form-container' onSubmit={(e) => handleSignUp(e)}>
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
        <a href='https://google.fr'>Account already exists ?</a>
      </p>
    </main>
  );
};

export default SignUp;
