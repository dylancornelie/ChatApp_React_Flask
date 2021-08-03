import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { addParticipant } from '../../actions/chat.action';

const AddParticipantPopUp = ({ outsideClickAction, meetingId }) => {
  const dispatch = useDispatch();
  const userStates = useSelector(state => state.userReducer);
  const [showQrCode, setShowQrCode] = useState(false);
  const [addByLogin, setAddByLogin] = useState(false);
  const [login, setLogin] = useState('');

  const handleAddByLogin = () => {
      dispatch(addParticipant(meetingId, login))
  };

  const viewWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  const viewHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  return (
    <div className='context-menu-backdrop' onClick={() => outsideClickAction()}>
      {showQrCode ? (
        <QRCode
          className='qrcode'
          value={meetingId}
          size={
            viewWidth * 0.8 > viewHeight * 0.7
              ? viewHeight * 0.7
              : viewWidth * 0.8
          }
        />
      ) : (
        <>
          {addByLogin ? (
            <div
              className='addbylogin-modal'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type='text'
                placeholder='login'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <div className='addbylogin-button-container'>
                <button onClick={() => setAddByLogin(!addByLogin)}>
                  Cancel
                </button>
                <button onClick={() => handleAddByLogin()}>Add</button>
              </div>
              <p className='addbylogin-infobox'>
                {userStates.addByLoginError}
              </p>
            </div>
          ) : (
            <div
              className='context-menu-button-container'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                className='context-menu-button'
                onClick={() => setShowQrCode(!showQrCode)}
              >
                Show QR code
              </button>
              <button
                className='context-menu-button'
                onClick={() => setAddByLogin(!addByLogin)}
              >
                Add by login
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddParticipantPopUp;
