import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAddParticipant } from '../../actions/chat.action';
import QRCode  from 'qrcode.react';

const AddParticipantPopUp = () => {
  const dispatch = useDispatch();
  const [showQrCode, setShowQrCode] = useState(false);
  const viewWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const viewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);


  return (
    <div
      className='context-menu-backdrop'
      onClick={() => dispatch(showAddParticipant())}
    >
      {showQrCode ? (
        <QRCode className='qrcode' value='heek yeaah' size= {(viewWidth*0.8 >viewHeight*0.7) ? viewHeight*0.7 : viewWidth*0.8}/>
      ) : (
        <div
          className='context-menu-button-container'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button className='context-menu-button' onClick={()=>setShowQrCode(!showQrCode)}>Show QR code</button>
          <button className='context-menu-button'>Add by login</button>
        </div>
      )}
    </div>
  );
};

export default AddParticipantPopUp;
