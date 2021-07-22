import React from 'react';
import { ImArrowLeft2 } from 'react-icons/im';


const Header = ({ title, leftIconAction }) => {
  return (
    <header className='header-with-back-arrow'>
      <ImArrowLeft2  onClick={leftIconAction} size={30}/>
      <p>{title}</p>
    </header>
  );
};

export default Header;
