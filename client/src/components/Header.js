import React from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import {IoIosArrowDown} from 'react-icons/io'

const Header = ({title}) => {
  return (
    <header>
        <ImArrowLeft2 size={30} />
        <p>{title}</p>
        <IoIosArrowDown size={30} />
    </header>
  );
};

export default Header;
