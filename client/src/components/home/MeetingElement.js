import React, { useEffect } from 'react';

const MeetingElement = ({ data, active }) => {
  useEffect(() => console.log(data, 'meeting element'));

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
