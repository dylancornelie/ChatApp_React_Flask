import React, { useEffect, useState } from 'react';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';
import { useHistory } from 'react-router';
import { tokenIsEmpty, tokenIsValid } from '../../utils/utils';

const CreateMeeting = () => {
  const history = useHistory();
  const [chatName, setChatName] = useState('');

  useEffect(()=> {
    if (tokenIsEmpty()|| !tokenIsValid()) history.push('/');
  })

  const handleCreateChat = (e) => {
    e.preventDefault();
  };

  const leftIconAction = () => {
    history.push('/home');
  };


  return (
    <>
      <HeaderWithArrow
        title={'Create your meeting'}
        leftIconAction={leftIconAction}
      />
      <div className='signin-page'>
        <Banner title='Enter a meeting name' />
        <form className='signin-form-container' onSubmit={handleCreateChat}>
          <input
            type='text'
            required
            placeholder='chat name'
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />

          <button>Create chat</button>
          <p className='signin-form-infobox'>Chatname already exists</p>
        </form>
      </div>
    </>
  );
};

export default CreateMeeting;
