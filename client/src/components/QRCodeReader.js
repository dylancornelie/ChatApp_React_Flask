import React from 'react';
import QrReader from 'react-qr-reader';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const QRCodeReader = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* <QrReader
      style={{ width: '50%' }}
      onScan={(e)=> {
        if(e!== null)
          console.log(e)
      }}/>*/}
      <BarcodeScannerComponent/>
<p>Ca marche presque </p>
    </div>
  );
};

export default QRCodeReader;
