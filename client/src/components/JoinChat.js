import React, { useState } from 'react';
//import QrReader from 'react-qr-reader';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import Banner from './utils/Banner';
import Header from './utils/HeaderWithArrow';

const JoinChat = () => {
  const [stopStream, setStopStream] = useState(false);
  const handleHeaderArrowClick = () => {
   
  }

  return (
    <>
      <Header
        title={'Join a new chat'}
        leftIconAction={handleHeaderArrowClick}
      />
      <main className='joinChat-container'>
        <Banner title='Scan a QR code to join a chat' />
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
      </main>
    </>
  );
};

export default JoinChat;
