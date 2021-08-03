import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ImArrowLeft2 } from 'react-icons/im';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { showParticipants } from '../../actions/chat.action';
import { isEmpty } from '../../utils/utils';

const ChatHeader = ({ title }) => {
  const dispatch = useDispatch();
  const chatStates = useSelector((state) => state.chatReducer);
  const history = useHistory();
  const [contextMenuToggled, setContextMenuToggled] = useState(false);

  return (
    <div className='chat-header'>
      <ImArrowLeft2 size={30} onClick={() => history.push('/home')} />
      <p>{title}</p>
      {contextMenuToggled ? (
        <IoIosArrowUp
          size={30}
          onClick={() => {
            dispatch(showParticipants());
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      ) : !isEmpty(chatStates.meeting) ? (
        <IoIosArrowDown
          size={30}
          onClick={() => {
            dispatch(showParticipants());
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ChatHeader;
