import React, { useEffect } from 'react';
import Loader from 'react-loader-spinner';
import ChatHeader from '../chat/ChatHeader';
import MessageInput from '../chat/MessageInput';
import MessageList from '../chat/MessageList';
import ParticipantList from '../chat/ParticipantList';
import { useDispatch, useSelector } from 'react-redux';
import ChatContextMenu from '../chat/ChatContextMenu';
import AddParticipantPopUp from '../chat/AddParticipantPopUp';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
import { showAddParticipant } from '../../actions/chat.action';

const Chat = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
  });

  return (
    <div className='chat-component-container'>
      {isEmpty(chatStates.meeting) ? (
        <>
        <ChatHeader title='Loading...' />
        <Loader
          type='Rings'
          color='#4f6d7a'
          height={300}
          width={300}
          style={{
            flexGrow:'1',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
          }}
        />
        </>
      ) : (
        <>
          <ChatHeader title={chatStates.meeting.title} />
          {chatStates.showParticipants && <ParticipantList />}
          {chatStates.showContextMenu && <ChatContextMenu />}
          {chatStates.showAddParticipant && (
            <AddParticipantPopUp
              outsideClickAction={() => dispatch(showAddParticipant())}
              meetingId={chatStates.meeting.id}
            />
          )}
          <MessageList />
          {(userStates.user.id === chatStates.meeting.owner.id ||
            chatStates.meeting.coaches.find(
              (coach) => coach.id === userStates.user.id
            )) && <MessageInput />}
        </>
      )}
    </div>
  );
};

export default Chat;
