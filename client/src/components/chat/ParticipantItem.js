import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { ShowContextMenu } from '../../actions/chat.action';

const ParticipantItem = () => {

  const dispatch = useDispatch();

  return (
    <div className='chat-participant-item' onClick={()=> dispatch(ShowContextMenu())}>
      <CgProfile size='45'/>
      <p className='chat-participant-item-name'>Paul Anguerand</p>
    </div>
  );
};

export default ParticipantItem;