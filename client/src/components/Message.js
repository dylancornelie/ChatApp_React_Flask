import React from 'react';
import { CgProfile } from 'react-icons/cg';

const Message = () => {

  return (
    <>
      <div style={{ display: 'flex', margin: '0px 0px 20px 0px' }}>
        <CgProfile style={{ alignSelf: 'flex-end' }} size='50' />
        <div
          style={{
            backgroundColor: 'orange',
            borderRadius: '30px 30px 30px 0px',
            maxWidth: '70vw',
            wordBreak: 'break-all',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              margin: '10px 15px 10px 15px',
              fontWeight: 'bold',
            }}
          >
            Dylan Cornelie
          </div>
          <div style={{ fontSize: '12px', margin: '10px 15px 10px 15px' }}>
            Regarde le lien stpl :
            https://fonts.google.com/specimen/Lato#standard-styles
          </div>
          <div
            style={{
              fontSize: '8px',
              fontStyle: 'italic',
              margin: '0px 15px 10px 15px',
            }}
          >
            Mon destinataire
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          textAlign: 'right',
          margin: '0px 0px 20px 0px',
        }}
      >
        <div
          style={{
            backgroundColor: 'orange',
            borderRadius: '30px 30px 0px 30px',
            maxWidth: '70vw',
            wordBreak: 'break-all',
          }}
        >
          <div
            style={{ fontSize: '12px', margin: '10px 15px 10px 15px' }}
          ></div>
          <div style={{ fontSize: '12px', margin: '10px 15px 10px 15px' }}>
            Regarde le lien stpl :
            https://fonts.google.com/specimen/Lato#standard-styles
          </div>
          <div
            style={{
              fontSize: '8px',
              fontStyle: 'italic',
              margin: '0px 15px 10px 15px',
            }}
          >
            Mon destinataire
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', margin: '0px 0px 20px 0px' }}>
        <CgProfile style={{ alignSelf: 'flex-end' }} size='50' />
        <div
          style={{
            backgroundColor: 'orange',
            borderRadius: '30px 30px 30px 0px',
            maxWidth: '70vw',
            wordBreak: 'break-all',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              margin: '10px 15px 10px 15px',
              fontWeight: 'bold',
            }}
          >
            Dylan Cornelie
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <div style={{ fontSize: '12px', margin: '10px 15px 10px 15px', alignSelf:'flex-start' }}>
            Regardez la photo que je vous ai envoyé !
          </div>
            <img
              src='./img/test_image.jpg'
              alt='test'
              style={{ maxWidth: '90%', margin: '10px 15px 10px 15px' }}
            />
          </div>
          <div
            style={{
              fontSize: '8px',
              fontStyle: 'italic',
              margin: '0px 15px 10px 15px',
            }}
          >
            Mon destinataire
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
