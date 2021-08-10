import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QrReader from 'react-qr-reader';
import { addParticipant } from '../../actions/chat.action';
import { isEmpty } from '../../utils/utils';

const AddParticipantPopUp = ({ outsideClickAction, meetingId }) => {
  const dispatch = useDispatch();
  const userStates = useSelector((state) => state.userReducer);
  const [flashQrCode, setFlashQrCode] = useState(false);
  const [addByLogin, setAddByLogin] = useState(false);
  const [login, setLogin] = useState('');

  const handleAddByLogin = () => {
    dispatch(addParticipant(meetingId, login));
  };

  return (
    <div className='context-menu-backdrop' onClick={() => outsideClickAction()}>
      {flashQrCode ? (
        <QrReader
          delay={300}
          onScan={(data) => {
            if (!isEmpty(data)) dispatch(addParticipant(meetingId, data));
          }}
          onError={console.error}
          style={{ width: '50%' }}
          showViewFinder={false}
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
              <p className='addbylogin-infobox'>{userStates.addByLoginError}</p>
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
                onClick={() => setFlashQrCode(!flashQrCode)}
              >
                Scan QR Codes
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
