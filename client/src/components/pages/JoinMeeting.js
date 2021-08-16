import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import QRCode from 'qrcode.react';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import { getUser } from '../../actions/user.action';

const JoinMeeting = () => {
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const history = useHistory();

  const viewWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  const viewHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  useEffect(() => {
    if (tokenIsEmpty() || !tokenIsValid()) history.push('/');
    if (isEmpty(userStates.user)) dispatch(getUser());
  }, [dispatch, history, userStates.user]);

  const handleHeaderArrowClick = () => {
    history.push('/home');
  };

  return (
    <>
      <HeaderWithArrow
        title={'Join a new meeting'}
        leftIconAction={handleHeaderArrowClick}
      />
      <div className='joinMeeting-container'>
        <Banner title='Show your QR code to join a meeting' />
        <QRCode
          className='qrcode'
          value={JSON.stringify({
            id:userStates.user.id,
            username: userStates.user.username,
            email: userStates.user.email,
            firstName: userStates.user.first_name,
          lastName: userStates.user.last_name,
          })}
          size={
            viewWidth * 0.6 > viewHeight * 0.5
              ? viewHeight * 0.5
              : viewWidth * 0.6
          }
          includeMargin={false}
          style={{ margin: '2rem 0 5rem 0' }}
        />
      </div>
    </>
  );
};

export default JoinMeeting;
