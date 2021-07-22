import React, { useState } from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { showParticipants } from '../../actions/chat.action';

const ChatHeader = ({ title }) => {
  const [contextMenuToggled, setContextMenuToggled] = useState(false);
  const dispatch = useDispatch();

  return (
    <header className='chat-header'>
      <ImArrowLeft2 size={30} />
      <p>{title}</p>
      {contextMenuToggled ? (
        <IoIosArrowUp
          size={30}
          onClick={() => {
            dispatch(showParticipants());
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      ) : (
        <IoIosArrowDown
          size={30}
          onClick={() => {
            dispatch(showParticipants());
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      )}
    </header>
  );
};

export default ChatHeader;
