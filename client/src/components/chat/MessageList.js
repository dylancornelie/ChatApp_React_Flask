import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMessages,
  fetchMoreMessages,
  scrolledToBottom,
  stopFetchMoreMessage,
} from '../../actions/chat.action';
import { isEmpty } from '../../utils/utils';
import Message from './Message';

const MessageList = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const userStates = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const messageEnd = useRef(null);
  const [loadMessage, setLoadMessage] = useState(true);
  
  const messagesLength = isEmpty(chatStates.messages)
    ? 0
    : chatStates.messages.length;

  useEffect(() => {
    if (loadMessage && !isEmpty(chatStates.meeting.id)) {
      dispatch(fetchMessages(chatStates.meeting.id));
      setLoadMessage(false);
    }

    if (chatStates.toScroll && !isEmpty(chatStates.messages)) {
      scrollToBottom();
      dispatch(scrolledToBottom());
    }
  }, [
    chatStates.meeting.id,
    chatStates.messages,
    messagesLength,
    dispatch,
    loadMessage,
    chatStates.toScroll,
  ]);

  useEffect(() => {
    const messageList = document.querySelector('.message-list');
    const loadMore = () => {
      if (
        chatStates.canFetchMoreMessage &&
        chatStates.hasNext?.hasNext &&
        messageList.scrollTop === 0
      ) {
        dispatch(stopFetchMoreMessage());
        dispatch(fetchMoreMessages(chatStates.hasNext?.linkToNext));
      }
    };
    messageList.addEventListener('scroll', loadMore);

    return () => {
      messageList.removeEventListener('scroll', loadMore);
    };
  });

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({
      behavior: 'instant',
      block: 'end',
      inline: 'nearest',
    });
  };

  return (
    <div className='message-list'>
      {!isEmpty(chatStates.messages) &&
        chatStates.messages
          .slice()
          .reverse()
          .map((message, index) => (
            <Message
              message={message}
              key={index}
              position={
                message.sender.id === userStates.user.id ? 'right' : 'left'
              }
            />
          ))}
      <div ref={messageEnd} />
    </div>
  );
};

export default MessageList;
