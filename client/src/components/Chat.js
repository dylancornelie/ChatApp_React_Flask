import React from 'react';
import ChatHeader from './chat/ChatHeader';
import MessageInput from './chat/MessageInput';
import MessageList from './chat/MessageList';
import ParticipantList from './chat/ParticipantList';
import { useSelector } from 'react-redux';
import ChatContextMenu from './chat/ChatContextMenu';
import AddParticipantPopUp from './chat/AddParticipantPopUp';

const Chat = () => {
  const chatStates = useSelector((state) => state.chatReducer);

  return (
    <div className='chat-component-container'>
      <ChatHeader title='Chat TX' />
      {chatStates.showParticipants && <ParticipantList />}
      {chatStates.showContextMenu && <ChatContextMenu />}
      {chatStates.showAddParticipant && <AddParticipantPopUp />}
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default Chat;
