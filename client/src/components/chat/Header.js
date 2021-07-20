import React, { useState } from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import { IoIosArrowDown,IoIosArrowUp } from 'react-icons/io';

const Header = ({ title, rightIconAction, rightIconActive }) => {
  const [contextMenuToggled, setContextMenuToggled] = useState(false);

  return (
    <header>
      <ImArrowLeft2 size={30} />
      <p>{title}</p>
      {!contextMenuToggled ? (
        <IoIosArrowUp
          size={30}
          onClick={() => {
            rightIconAction();
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      ) : (
        <IoIosArrowDown
          size={30}
          onClick={() => {
            rightIconAction();
            setContextMenuToggled(!contextMenuToggled);
          }}
        />
      )}
    </header>
  );
};

export default Header;
