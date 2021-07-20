import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessageReceiver, showContextMenu } from '../../actions/chat.action';

const ChatContextMenu = () => {

  const dispatch = useDispatch();

  return (
    <div
      className='context-menu-backdrop'
      onClick={() => dispatch(showContextMenu())}
    >
      <div
        className='context-menu-button-container'
        onClick={(e) => {
          //e.stopPropagation();
        }}
      >
        <button className='context-menu-button' onClick={()=>dispatch(setMessageReceiver('usernaaamme !!'))}>Send a private message</button>
        <button className='context-menu-button'>Designate coach</button>
        <button className='context-menu-button'>Remove participant</button>
      </div>
    </div>
  );
};

export default ChatContextMenu;
