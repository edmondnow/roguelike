import React, { Component } from 'react';

const StatusBar = (props) => {
  const { lvl, dmg, health, weapon, xp, xpthreshold, lights} = props.props
  
  return (
    <div>
      <div className="statusbar">
        <span className="gap">
          <img src="./src/assets/char/avatar.png" alt="charavatar" id="charavatar"/> {lvl}/10
        </span>
        <span className="gap">
          xp {xp}/{xpthreshold}
        </span>
        <span className="gap">
          <img src="./src/assets/heart.png" alt="heart" id="heart"/>{health}/100
        </span>
        <span className="gap">
          <img src={weapon} alt="sword" id="sword"/>{dmg}/60
        </span>
        <span className="gap">
          Lights <button id="lights" onClick={props.lightSwitch}>{ lights ? 'on' : 'off' }</button>
        </span>
      </div>
    </div>
  )
}


export default StatusBar;