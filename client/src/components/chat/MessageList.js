import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../actions/chat.action';
import data from '../../data/messages.json';
import { isEmpty } from '../../utils/utils';
import Message from './Message';

const MessageList = () => {
  const chatStates = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();
  const messageEnd = useRef(null);
  const [loadMessage,setLoadMessage] = useState(true)

  useEffect(() => {
    if ( loadMessage && !isEmpty(chatStates.meeting.id)){
      dispatch(fetchMessages(chatStates.meeting.id));
      setLoadMessage(false)
    }
  }, [chatStates.meeting.id, chatStates.messages, dispatch, loadMessage]);

  const scrollToBottom = () => {
    messageEnd.current.scrollIntoView({
      behavior: 'instant',
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
      }, 10);
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
