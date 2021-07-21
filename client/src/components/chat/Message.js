import React from 'react';
import { addAnchorTag, isEmpty } from '../../utils/utils';
import parser from 'html-react-parser';

const Message = ({ data, position }) => {
  return (
    <div
      className='message-item'
      style={
        position === 'right'
          ? { flexDirection: 'row-reverse' }
          : { flexDirection: 'row' }
      }
    >
      {position === 'left' && (
        <img
        className='message-sender-pic'
          src='./image/avatar.svg'
          alt='profil pic'
        />
      )}
      <div
        className='message-bubble'
        style={
          position === 'left'
            ? {
                backgroundColor: '#4F6D7A',
                color: '#dbe9ee',
                borderRadius: '15px 15px 15px 0px',
              }
            : {
                backgroundColor: '#4F6D7A',
                color: '#dbe9ee',
                borderRadius: '15px 15px 0px 15px',
              }
        }
      >
        {position === 'left' && <p className='message-sender'>{data.sender}</p>}
        <p className='message-content'>{parser(addAnchorTag(data.content))}</p>
        {!isEmpty(data.file) && data.fileType === 'img' && (
          <a href={data.file} className='message-image-container'>
            <img src={data.file} alt='message pic' className='message-image' />
          </a>
        )}
        <p
          className='message-receiver'
          style={
            position === 'right'
              ? { textAlign: 'right' }
              : { textAlign: 'left' }
          }
        >
          {data.receiver}
        </p>
      </div>
    </div>
  );
};

export default Message;
