import React from 'react';
import { IoAdd } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showAddParticipant } from '../../actions/chat.action';
import ParticipantItem from './ParticipantItem';

const ParticipantList = () => {

  const dispatch = useDispatch();

  return (
    <div className='chat-participant-list'>
      <div
        className='chat-participant-item'
        onClick={() => dispatch(showAddParticipant())}
      >
        <IoAdd size='45' color='#4f6d7a' style={{backgroundColor:'#dbe9ee', borderRadius:'50%', padding:'3px', marginBottom:'24px'}}/>
        <p className='chat-participant-item-name'> </p>
      </div>
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
      <ParticipantItem />
    </div>
  );
};

export default ParticipantList;
