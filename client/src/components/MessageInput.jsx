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

  const [height,setHeight] = useState(40);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      }}
    >
      <div
        style={{
          backgroundColor: '#DBE9EE',
          borderRadius: '50px 0px 0px 50px',
          paddingLeft: '10px',
        }}
      >
        <label htmlFor='file-input'>
          <GrAttachment
            size='30'
            color='#4F6D7A'
            style={{
              cursor: 'pointer',
              margin: (height / 2 - 7) + 'px 0px ' + (height / 2 - 7) + 'px 0px',
              backgroundColor: '#DBE9EE',
            }}
          />
        </label>
        <input id='file-input' type='file' style={{ display: 'none' }} />
      </div>
      <textarea
        placeholder='write a message...'
        style={{
          width: '200px',
          height: height + 'px',
          resize: 'none',
          lineHeight: '20px',
          padding: '20px 10px 0px 10px',
          backgroundColor: '#DBE9EE',
          color: '#4F6D7A',
          border: 'none',
          textAlign: 'left',
          verticalAlign: 'center',
        }}
        className='messageInput'
        onKeyUp={(event) => {
          //event.target.style.height = calcHeight(event.target.value) + 'px';
          calcHeight(event.target.value);
        }}
      ></textarea>
      <div
        style={{
          backgroundColor: '#DBE9EE',
          borderRadius: '0px 50px 50px 0px',
          paddingRight: '10px',
        }}
        onClick={() => console.log('sending message...')}
      >
        <IoSend
          size='30'
          color='#4F6D7A'
          style={{
            cursor: 'pointer',
            backgroundColor: '#DBE9EE',
            margin:(height / 2 - 7) + 'px 0px ' + (height / 2 - 7) + 'px 0px',
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;
