import React from 'react';
import { useDispatch } from 'react-redux';
import { showContextMenu } from '../../actions/chat.action';

const ParticipantItem = ({user}) => {

  const dispatch = useDispatch();

  return (
    <div className='chat-participant-item' onClick={()=> dispatch(showContextMenu())}>
      <img src='./image/avatar.svg' alt='profil pic' />
      <p className='chat-participant-item-name'>{`${user.first_name} ${user.last_name}`}</p>
    </div>
  );
};

export default ParticipantItem;