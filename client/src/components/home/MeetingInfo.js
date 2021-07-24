import React, { useEffect, useState } from 'react';

const MeetingInfo = ({ data }) => {
  const [active, setActive] = useState(false);

  useEffect(() => console.log(data, 'meeting info'));

  return (
    <div className='meetingInfo-container' onClick={(e) => e.stopPropagation()}>
      <p>Participants list</p>
      <div className='meetingInfo-participant-list'>
        {data.participants.map((participant) => (
          <p
            key={participant.id}
            onClick={() => {
              setActive(participant.id);
              console.log(participant);
            }}
            style={
              active === participant.id
                ? {
                    backgroundColor: '#4F6D7A',
                    color: '#DBE9EE',
                  }
                : {}
            }
          >
            {participant.name}
          </p>
        ))}
      </div>
      <div className='meetingInfo-button-container'>
        <button>Add participant</button>
        <button>Remove participant</button>
        <button>Join chat</button>
        <button className='red-button'>Quit meeting</button>
      </div>
    </div>
  );
};

export default MeetingInfo;
