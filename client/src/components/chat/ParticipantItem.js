import React from 'react';
import { useDispatch } from 'react-redux';
import { showContextMenu } from '../../actions/chat.action';

const ParticipantItem = () => {

  const dispatch = useDispatch();

  return (
    <div className='chat-participant-item' onClick={()=> dispatch(showContextMenu())}>
      <img src='./img/avatar.svg' alt='profil pic' style={{height:'48px', backgroundColor:'#DBE9EE', borderRadius:'50%', marginBottom:'5px'}}/>
      <p className='chat-participant-item-name'>Paul Anguerand</p>
    </div>
  );
};

export default ParticipantItem;