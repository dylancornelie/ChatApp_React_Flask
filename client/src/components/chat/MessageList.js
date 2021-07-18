import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import data from '../../data/messages.json';
import Message from './Message';

const MessageList = () => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const [toBottom, setToBottom] = useState();

  useEffect(() => {
    if (!toBottom) scrollToBottom();
    setToBottom(true);
  }, [toBottom]);

  const chatState = useSelector((state) => state.chatReducer);

  return (
    <div
      className='message-list'
      style={
        chatState.showParticipants
          ? { height: 'calc(100vh - 40px  - 60px - 90px)' }
          : { height: 'calc(100vh - 40px  - 60px - 0px)' }
      }
    >
      {data.map((element) => (
        <Message data={element} key={element.id} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
