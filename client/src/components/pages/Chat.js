import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import ChatHeader from '../chat/ChatHeader';
import MessageInput from '../chat/MessageInput';
import MessageList from '../chat/MessageList';
import ParticipantList from '../chat/ParticipantList';
import ChatContextMenu from '../chat/ChatContextMenu';
import AddParticipantPopUp from '../chat/AddParticipantPopUp';
import {
  refreshMeetingData,
  sendMessage,
  showAddParticipant,
} from '../../actions/chat.action';

const Chat = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useRef();

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
    if (!isEmpty(chatStates.meeting)) {
      const meetingId = chatStates.meeting.id;
      const refreshMeeting = userStates.meetings.find(
        (meeting) => meeting.id === meetingId
      );
      if (!isEmpty(refreshMeeting))
        dispatch(refreshMeetingData(refreshMeeting));
      else history.push('/home');
    } else history.push('/home');

    if (isEmpty(socket.current) || !socket.current.status)
      socket.current = io(`${process.env.REACT_APP_API_URL}/ws/messages`, {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    if (!isEmpty(socket.current)) {
      socket.current.on('connect', () =>
        console.log(
          `Successfully connected to chat : ${chatStates.meeting.title}`
        )
      );

      socket.current.on('connect_error', (error) =>
        console.error(`Socket onnection error : ${error}`)
      );

      socket.current.on('error', (error) =>
        console.error(`Error in socket : ${error}`)
      );

      socket.current.on('receive_message', (data) => {
        console.log(`Message received : `, data);
        dispatch(sendMessage(data));
      });

      socket.current.emit('join_project', {
        project_id: chatStates.meeting.id,
      });
    }

    return () => {
      if (!isEmpty(socket.current)) {
        socket.current.emit('leave_project', {
          project_id: chatStates.meeting.id,
        });
        socket.current.on('disconnect', () =>
          console.log('Socket successfully disconnected')
        );
        socket.current.disconnect();
      }
    };
  }, [userStates.meetings, history, chatStates.meeting, dispatch]);

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
              flexGrow: '1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
            )) && <MessageInput socket={socket.current} />}
        </>
      )}
    </div>
  );
};

export default Chat;
