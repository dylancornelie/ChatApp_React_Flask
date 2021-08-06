import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import QRCode from 'qrcode.react';
import Banner from '../utils/Banner';
import HeaderWithArrow from '../utils/HeaderWithArrow';
import { isEmpty, tokenIsEmpty, tokenIsValid } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../actions/user.action';

const JoinMeeting = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);

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
    if (isEmpty(userStates.user) && tokenIsValid()) dispatch(getUser());
  });

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
          value={userStates.user.login}
          size={
            viewWidth * 0.8 > viewHeight * 0.7
              ? viewHeight * 0.7
              : viewWidth * 0.8
          }
          includeMargin={true}
        />
      </div>
    </>
  );
};

export default JoinMeeting;
