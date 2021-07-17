import React from 'react';
import Header from './Header';
import MessageInput from './MessageInput'
import MessageList from './MessageList';
import ParticipantList from './ParticipantList';

const Chat = () => {
  return (
    <div>
      <Header title='Chat TX'/>
      <ParticipantList/>
      <MessageList/>
      <MessageInput />
    </div>
  );
};

export default Chat;