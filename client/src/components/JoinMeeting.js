import React, { useState } from 'react';
import { useHistory } from 'react-router';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import Banner from './utils/Banner';
import HeaderWithArrow from './utils/HeaderWithArrow';

const JoinMeeting = () => {
  const history = useHistory();
  const [stopStream, setStopStream] = useState(false);

  const handleHeaderArrowClick = () => {
   history.push('/home')
  }

  return (
    <>
      <HeaderWithArrow
        title={'Join a new meeting'}
        leftIconAction={handleHeaderArrowClick}
      />
      <div className='joinMeeting-container'>
        <Banner title='Scan a QR code to join a meeting' />
        <BarcodeScannerComponent
          width='70%'
          stopStream={stopStream}
          onUpdate={(err, result) => {
            if (result) {
              console.log(result);
              setStopStream(true);
            }
          }}
        />
      </div>
    </>
  );
};

export default JoinMeeting;
