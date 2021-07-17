import React from 'react';
import Header from './Header';
import MessageInput from './MessageInput'
import MessageList from './MessageList';

const Chat = () => {
  return (
    <div style={{backgroundColor:'#F8F9FA'}}>
      <Header/>
      <MessageList/>
      <MessageInput />
    </div>
  );
};

export default Chat;