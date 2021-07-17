import React from 'react';
import { CgProfile } from 'react-icons/cg';

const ParticipantItem = () => {
  return (
    <div style={{display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'flex-start'}}>
      <CgProfile size='45'/>
      <p style={{fontSize:'10px', textAlign:'center'}}>Pierre Jacque</p>
    </div>
  );
};

export default ParticipantItem;