import React, { Component } from 'react';

const StatusBar = (props) => {
  const { lvl, dmg, health, weapon} = props.props
  
  return (
    <div>
      <img src="./src/assets/bakerycraft.png" alt="bakerycraft" id="craft" />
      <div className="statusbar">
        <img src="./src/assets/heart.png" alt="heart" id="heart"/>{health}
        lvl: {lvl},
        <img src={weapon} alt="heart" id="heart"/>{dmg}
      </div>
    </div>
  )
}


export default StatusBar;