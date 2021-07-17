import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { addAnchorTag, isEmpty } from '../utils/utils';
import parser from 'html-react-parser'

const Message = ({ data }) => {
  return (
    <div className='message-item'>
      <CgProfile color='#000' style={{ alignSelf: 'flex-end' }} size='50' />
      <div
        className='message-bubble'
        style={{
          backgroundColor: '#4F6D7A',
          color: '#dbe9ee',
          borderRadius: '30px 30px 30px 0px',
        }}
      >
        <p
          className='message-sender'
        >
          {data.sender}
        </p>
        <p className='message-content'>
          { parser(addAnchorTag(data.content))}
        </p>
        {!isEmpty(data.file) && data.fileType === 'img' && (
          <a href={data.file}>
          <img
            src={data.file}
            alt=''
            className='message-image'
          />
          </a>
        )}
        <p
        className='message-receiver'
        >
          {data.receiver}
        </p>
      </div>
    </div>
  );
};

export default Message;
