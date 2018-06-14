import React, { Component } from 'react';

const StatusBar = (props) => {
  const { lvl, dmg, health, weapon, xp, xpthreshold, lights} = props.props
  
  return (
    <div>
      <div className="statusbar">
        <span className="gap">
          <img src="./src/assets/char/avatar.png" alt="charavatar" id="charavatar"/> {lvl}/5
        </span>
        <span className="gap">
          {xp.length == 1 ? `00${xp}` : `${xp}` }/{xpthreshold}
        </span>
        <span className="gap">
          <img src="./src/assets/heart.png" alt="heart" id="heart"/>{health}
        </span>
        <span className="gap">
          <img src={weapon} alt="sword" id="sword"/>{dmg}/100
        </span>
        <span className="gap">
          Lights <button id="lights" onClick={props.lightSwitch}>{ lights ? 'on' : 'off' }</button>
        </span>
      </div>
    </div>
  )
}


export default StatusBar;