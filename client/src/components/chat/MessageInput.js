import React, { useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';

const MessageInput = () => {
  function calcHeight(value) {
    const numberOfLineBreaks = (value.match(/\n/g) || []).length;
    if (numberOfLineBreaks > 5) return 20 + 5 * 20 + 0 + 0;
    // min-height + lines x line-height + padding + border
    const newHeight = 40 + numberOfLineBreaks * 20 + 0 + 0;
    setHeight(newHeight);
    return newHeight;
  }

  const [height, setHeight] = useState(40);

  return (
    <div className='messageInput-container'>
      <div className='left-logo-container'>
        <label htmlFor='file-input'>
          <GrAttachment
            className='logo'
            size='30'
            color='#4F6D7A'
            style={{
              margin: height / 2 - 7 + 'px 0px ' + (height / 2 - 7) + 'px 0px',
            }}
          />
        </label>
        <input id='file-input' type='file' style={{ display: 'none' }} />
      </div>
      <textarea
        placeholder='write a message...'
        style={{
          height: height + 'px',
        }}
        className='messageInput'
        onKeyUp={(event) => {
          //event.target.style.height = calcHeight(event.target.value) + 'px';
          calcHeight(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            //event.preventDefault();
            console.log('sending message...');
          }
        }}
      ></textarea>
      <div
        className='right-logo-container'
        onClick={() => console.log('sending message...')}
      >
        <IoSend
          size='30'
          color='#4F6D7A'
          className='logo'
          style={{
            margin: height / 2 - 7 + 'px 0px ' + (height / 2 - 7) + 'px 0px',
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;
