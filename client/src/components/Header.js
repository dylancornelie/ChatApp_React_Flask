import React from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import {IoIosArrowDown} from 'react-icons/io'

const Header = ({title, rightIconAction}) => {
  return (
    <header>
        <ImArrowLeft2 size={30} />
        <p>{title}</p>
        <IoIosArrowDown size={30} onClick={()=>rightIconAction()}/>
    </header>
  );
};

export default Header;
