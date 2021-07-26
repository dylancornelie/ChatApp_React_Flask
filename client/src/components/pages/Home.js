import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getUser } from '../../actions/user.action';
import data from '../../data/meetings.json';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import HomeHeader from '../home/HomeHeader';
import MeetingElement from '../home/MeetingElement';
import MeetingInfo from '../home/MeetingInfo';

const Home = () => {
  const history = useHistory();
  const [moreInfo, setMoreInfo] = useState(null);
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
    if (isEmpty(userStates.user)) dispatch(getUser());
  },[userStates.user,dispatch,history]);

  return (
    <div className='home-container'>
      <HomeHeader />
      <div className='home-meetingCard-meeting-list'>
        {data.map((meeting) => (
          <div
            key={meeting.id}
            style={
              meeting.id === moreInfo
                ? {
                    maxWidth: '90%',
                    width: '37.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                : { maxWidth: '90%', width: '37.5rem' }
            }
            onClick={() => {
              if (moreInfo === meeting.id) {
                setMoreInfo(null);
              } else {
                setMoreInfo(meeting.id);
              }
            }}
          >
            <MeetingElement data={meeting} active={meeting.id === moreInfo} />
            {meeting.id === moreInfo && <MeetingInfo data={meeting} />}
          </div>
        ))}
      </div>
      <div className='home-button-container'>
        <button onClick={() => history.push('/meeting/create')}>
          Create a meeting
        </button>
        <button onClick={() => history.push('/meeting/join')}>
          Join a new meeting
        </button>
      </div>
    </div>
  );
};

export default Home;
