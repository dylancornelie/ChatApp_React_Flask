import React, { useState } from 'react';
import Banner from './utils/Banner';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log(
      'je me login avec email : ' + email + 'et password : ' + password
    );
  };

  return (
    <main className='signin-page'>
      <Banner title='Sign in into your account' />
      <form className='signin-form-container' onSubmit={(e) => handleSignIn(e)}>
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
        <p className='signin-form-infobox'>Bad login or password</p>
      </form>
      <p className='signin-form-bottom-link'>
        <a href='https://google.fr'>Create an account</a>
      </p>
    </main>
  );
};

export default SignIn;
