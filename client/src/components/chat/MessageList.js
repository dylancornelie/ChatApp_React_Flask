import React, { useEffect, useRef, useState } from 'react';
import data from '../../data/messages.json';
import Message from './Message';

const MessageList = () => {
  const messageEnd = useRef(null);

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  const [toBottom, setToBottom] = useState();

  useEffect(() => {
    if (!toBottom) {
      setTimeout(function () {
        scrollToBottom();
        setToBottom(true);
      }, 100);
    }

    
  }, [toBottom]);

  return (
    <div className='message-list'>
      {data.map((element) => {
        if (element.id % 2 === 0)
          return <Message data={element} key={element.id} position='right' />;
        else return <Message data={element} key={element.id} position='left' />;
      })}
      {data.map((element) => {
        if (element.id % 2 === 0)
          return <Message data={element} key={element.id} position='right' />;
        else return <Message data={element} key={element.id} position='left' />;
      })}
      {data.map((element) => {
        if (element.id % 2 === 0)
          return <Message data={element} key={element.id} position='right' />;
        else return <Message data={element} key={element.id} position='left' />;
      })}
      <div ref={messageEnd} />
    </div>
  );
};

export default MessageList;
