import React, { useEffect, useRef } from 'react';
import data from '../data/messages.json';
import Message from './Message';

const MessageList = () => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom);

  return (
    <div className='message-list' style={{  height: 'calc(100vh - 40px - 50px - 60px)'}}>
      {data.map((element) => (
        <Message data={element} key={element.id} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
