import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Banner from './utils/Banner';

const SignIn = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log(
      'je me login avec email : ' + email + 'et password : ' + password
    );

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
        <p className='signin-form-infobox'>Bad login or password</p>
      </form>
      <p className='signin-form-bottom-link'>
      <Link to="/signup">Create an account</Link>

      </p>
    </div>
  );
};

export default SignIn;
