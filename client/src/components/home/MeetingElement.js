import React from 'react';

const MeetingElement = ({ data, active }) => {

  return (
    <div
      className={
        active ? 'meetingElement-container active' : 'meetingElement-container'
      }
    >
      <p>{data.meetingName}</p>
    </div>
  );
};

export default MeetingElement;
