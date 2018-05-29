import React, { Component } from 'react';

const StatusBar = (props) => {
  const { lvl, dmg, health, weapon} = props.props
  
  return (
    <div>
      <div className="statusbar">
        <span className="gap">
          <img src="./src/assets/char/avatar.png" alt="charavatar" id="charavatar"/> {lvl}/10
        </span>
        <span className="gap">
          xp {lvl}/300
        </span>
        <span className="gap">
          <img src="./src/assets/heart.png" alt="heart" id="heart"/>{health}/100
        </span>
        <span className="gap">
          <img src={weapon} alt="sword" id="sword"/>{dmg}/60
        </span>
      </div>
    </div>
  )
}


export default StatusBar;