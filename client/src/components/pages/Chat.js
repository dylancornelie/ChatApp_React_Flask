import React, { useEffect } from 'react';
import ChatHeader from '../chat/ChatHeader';
import MessageInput from '../chat/MessageInput';
import MessageList from '../chat/MessageList';
import ParticipantList from '../chat/ParticipantList';
import { useSelector } from 'react-redux';
import ChatContextMenu from '../chat/ChatContextMenu';
import AddParticipantPopUp from '../chat/AddParticipantPopUp';
import { tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import { useHistory } from 'react-router-dom';

const Chat = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const history = useHistory();

  useEffect(()=> {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
  })

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
