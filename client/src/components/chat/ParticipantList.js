import React, { useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showAddParticipant } from '../../actions/chat.action';
import ParticipantItem from './ParticipantItem';

const ParticipantList = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    let isDown = false;
    let startX = null;
    let scrollLeft = null;

    const setIsDown = (statut) => (isDown = statut);
    const mouseDownHandler = (e) => {
      startX = e.pageX - participantList.offsetLeft;
      scrollLeft = participantList.scrollLeft;
      setIsDown(true);
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - participantList.offsetLeft;
      const walk = x - startX; //scroll-fast
      participantList.scrollLeft = scrollLeft - walk;
    };

    const participantList = document.querySelector('.chat-participant-list');
    participantList.addEventListener('mousedown', (e) => mouseDownHandler(e));
    participantList.addEventListener('mouseleave', () => setIsDown(false));
    participantList.addEventListener('mouseup', () => setIsDown(false));
    participantList.addEventListener('mousemove', (e) => mouseMoveHandler(e));

    return () => {
      participantList.removeEventListener('mousemove', mouseMoveHandler);
      participantList.removeEventListener('mouseup', setIsDown);
      participantList.removeEventListener('mouseleave', setIsDown);
      participantList.removeEventListener('mousedown', mouseDownHandler);
    };
  });

  return (
    <div className='chat-participant-list'>
      <div style={{marginBottom:'2rem'}}>
      <div className='chat-participant-item'>
        <IoAdd
          size='45'
          color='#4f6d7a'
          className='chat-participant-item-add-logo'
          onClick={() => dispatch(showAddParticipant())}
        />
      </div>
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
