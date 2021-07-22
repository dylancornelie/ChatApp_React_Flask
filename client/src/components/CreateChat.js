import React, { useState } from 'react';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';

const CreateChat = () => {

  const handleCreateChat = (e) =>{
    e.preventDefault();
  }

  const [chatName,setChatName] = useState('');

  return (
    <>
      <HeaderWithArrow title={'Create your chat'}/>
      <main className='signin-page'>
        <Banner title='Enter a chat name' />
        <form
          className='signin-form-container'
          onSubmit={(e) => handleCreateChat(e)}
        >
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

      </main>
    </>
  );
};

export default CreateChat;
