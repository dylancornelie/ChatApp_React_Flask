import React from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import { IoLogoTableau } from 'react-icons/io5';

const Header = () => {
  return (
    <header style={{ backgroundColor: '4F6D7A' }}>
      <div style={{ height: '40px',display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
        <ImArrowLeft2 size={30} />
        <p>Réunion TX</p>
        <IoLogoTableau size={30} />
      </div>
    </header>
  );
};

export default Header;
