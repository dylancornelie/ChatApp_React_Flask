import React from 'react';
import { useDispatch } from 'react-redux';
import { showContextMenu } from '../../actions/chat.action';

const ParticipantItem = () => {

  const dispatch = useDispatch();

  return (
    <div className='chat-participant-item' onClick={()=> dispatch(showContextMenu())}>
      <img src='./image/avatar.svg' alt='profil pic' />
      <p className='chat-participant-item-name'>Paul Anguerand</p>
    </div>
  );
};

export default ParticipantItem;