import React from 'react';
import Header from './Header';
import MessageInput from './chat/MessageInput';
import MessageList from './chat/MessageList';
import ParticipantList from './chat/ParticipantList';
import { useDispatch, useSelector } from 'react-redux';
import { showParticipants } from '../actions/chat.action';
import ChatContextMenu from './chat/ChatContextMenu';

const Chat = () => {
  const chatState = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();
  const rightIconAction = () => dispatch(showParticipants());

  return (
    <>
      <Header title='Chat TX' rightIconAction={rightIconAction} />
      {chatState.showParticipants && <ParticipantList />}
      {chatState.showContextMenu && <ChatContextMenu/>}
      <MessageList />
      <MessageInput />
    </>
  );
};

export default Chat;
