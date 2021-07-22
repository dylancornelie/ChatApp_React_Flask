import React, { useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { IoAdd, IoSend } from 'react-icons/io5';
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/utils';
import { setMessageReceiver } from '../../actions/chat.action';

const MessageInput = () => {
  const chatState = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();

  function calcHeight(value) {
    const numberOfLineBreaks = (value.match(/\n/g) || []).length;
    if (numberOfLineBreaks > 5) return 25 + 5 * 20 + 0 + 0;
    // min-height + lines x line-height + padding + border
    const newHeight = 25 + numberOfLineBreaks * 20 + 0 + 0;
    setHeight(newHeight);
    return newHeight;
  }

  const handleSendMessage = () => {};

  const [height, setHeight] = useState(25);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  return (
    <div className='messageInput-container'>
      {!isEmpty(chatState.messageReceiver) && isEmpty(file) && (
        <div className='messageInput-infobox'>
          <p className='messageInput-infobox-message'>
            This message will be sent to
          </p>
          <IoAdd
            className='messageInput-infobox-logo'
            size='20'
            onClick={() => dispatch(setMessageReceiver(''))}
          />
        </div>
      )}
      {!isEmpty(file) && isEmpty(chatState.messageReceiver) && (
        <div className='messageInput-infobox'>
          <p className='messageInput-infobox-message'>
            Attached file : {file[0].name}
          </p>
          <IoAdd
            className='messageInput-infobox-logo'
            size='20'
            onClick={() => setFile(null)}
          />
        </div>
      )}
      {!isEmpty(file) && !isEmpty(chatState.messageReceiver) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className='messageInput-infobox' style={{ borderRadius: '0' }}>
            <p className='messageInput-infobox-message'>
              Attached file : {file[0].name}
            </p>
            <IoAdd
              className='messageInput-infobox-logo'
              size='20'
              onClick={() => setFile(null)}
            />
          </div>
          <div className='messageInput-infobox' style={{ top: '-62px' }}>
            <p className='messageInput-infobox-message'>
              This message will be sent to {chatState.messageReceiver}
            </p>
            <IoAdd
              className='messageInput-infobox-logo'
              size='20'
              onClick={() => dispatch(setMessageReceiver(''))}
            />
          </div>
        </div>
      )}
      <div className='left-logo-container'>
        {isEmpty(file) ? (
          <>
            <label htmlFor='file-input'>
              <FiPaperclip className='logo' size='30' color='#4F6D7A' />
            </label>

            <input
              id='file-input'
              type='file'
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files)}
            />
          </>
        ) : (
          <TiDeleteOutline
            size='30'
            color='#4F6D7A'
            className='logo'
            onClick={() => setFile(undefined)}
          />
        )}
      </div>
      <textarea
        placeholder='write a message...'
        style={{
          height: height + 'px',
        }}
        className='messageInput'
        onKeyUp={(event) => {
          calcHeight(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === 'Enter' && !event.shiftKey && handleSendMessage();
        }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
      ></textarea>
      <div className='right-logo-container' onClick={() => handleSendMessage()}>
        <IoSend size='30' color='#4F6D7A' className='logo' />
      </div>
    </div>
  );
};

export default MessageInput;
