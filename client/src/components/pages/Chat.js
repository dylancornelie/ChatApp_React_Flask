import React, { useEffect } from 'react';
import ChatHeader from '../chat/ChatHeader';
import MessageInput from '../chat/MessageInput';
import MessageList from '../chat/MessageList';
import ParticipantList from '../chat/ParticipantList';
import { useDispatch, useSelector } from 'react-redux';
import ChatContextMenu from '../chat/ChatContextMenu';
import AddParticipantPopUp from '../chat/AddParticipantPopUp';
import { tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
import { showAddParticipant } from '../../actions/chat.action';

const Chat = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
  });

  return (
    <div className='chat-component-container'>
      <ChatHeader title='Chat TX' />
      {chatStates.showParticipants && <ParticipantList />}
      {chatStates.showContextMenu && <ChatContextMenu />}
      {chatStates.showAddParticipant && (
        <AddParticipantPopUp
          outsideClickAction={() => dispatch(showAddParticipant())}
          meetingId={chatStates.meetingId}
        />
      )}
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default Chat;
