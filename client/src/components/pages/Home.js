import React, { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getMeetings, getUser } from '../../actions/user.action';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import HomeHeader from '../home/HomeHeader';
import MeetingElement from '../home/MeetingElement';
import MeetingInfo from '../home/MeetingInfo';

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const [moreInfo, setMoreInfo] = useState(null);
  const [meetingFetched, setMeetingFetched] = useState(false);

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
    if (isEmpty(userStates.user)) dispatch(getUser());
  }, [dispatch, history, userStates.user]);

  useEffect(() => {
    if (isEmpty(userStates.meetings) && !meetingFetched) {
      dispatch(getMeetings());
      setMeetingFetched(true);
    }
  }, [dispatch, meetingFetched, userStates.meetings]);

  return (
    <div className='home-container'>
      <HomeHeader />
      <div className='home-meetingCard-meeting-list'>
        {!isEmpty(userStates.meetings) ? (
          userStates.meetings.map((meeting) => (
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
              <MeetingElement
                meeting={meeting}
                active={meeting.id === moreInfo}
              />
              {meeting.id === moreInfo && <MeetingInfo meeting={meeting} />}
            </div>
          ))
        ) : (
          <Loader
            type='Rings'
            color='#4f6d7a'
            height={200}
            width={200}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: '1',
            }}
          />
        )}
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
