import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showContextMenu } from '../../actions/chat.action';

const ParticipantItem = ({ user, isCoach, isOwner }) => {
  const userStates = useSelector((state) => state.userReducer);
  const chatStates = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (
      userStates.user.id === chatStates.meeting.owner.id ||
      chatStates.meeting.coaches.find(
        (coach) => coach.id === userStates.user.id
      )
    )
      dispatch(showContextMenu(user, isCoach));
  };

  return (
    <div className='chat-participant-item' onClick={handleClick}>
      <img src='./image/avatar.svg' alt='profil pic' />
      <p
        className='chat-participant-item-name'
        style={
          isCoach && !isOwner
            ? { textDecoration: 'underline' }
            : isOwner
            ? { textDecoration: 'underline', fontStyle: 'italic' }
            : {}
        }
      >{`${user.first_name} ${user.last_name}`}</p>
    </div>
  );
};

export default ParticipantItem;
