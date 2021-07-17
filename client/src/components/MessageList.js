import React, {useEffect, useRef} from 'react';
import Message from './Message'

const MessageList = () => {

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({behavior:'smooth'})
  }

  useEffect(scrollToBottom);

  return (
    <div className='message-list'>
      <Message/>
      <Message/>
    <div ref={messagesEndRef}/>
    </div>
  );
};

export default MessageList;
