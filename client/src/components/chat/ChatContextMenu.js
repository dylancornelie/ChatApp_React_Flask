import React from 'react';
import { useDispatch } from 'react-redux';
import { ShowContextMenu } from '../../actions/chat.action';

const Popup = () => {

  const dispatch = useDispatch();

  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        height: '100vh',
        backgroundColor: 'black',
        width: '100vw',
        opacity: '0.8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => dispatch(ShowContextMenu())}
    >
      <div
        style={{
          backgroundColor: 'green',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => {
          e.stopPropagation();
          console.log('on a prevenu');
        }}
      >
        <button>Send private message</button>
        <button>Designate coach</button>
        <button>Remove participant</button>
      </div>
    </div>
  );
};

export default Popup;
