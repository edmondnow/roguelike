import React, { Component } from 'react';

let Menu = props =>{

  return(
    <div id="menu"> 
      <img id="bakery" src="./src/assets/BAKERYCRAFT.png" alt="BAKERYCRAFT" />
       <div id="ins">Use your <img id="arrows" src="./src/assets/arrows.png" alt="arrows" /> and bump into monsters! </div>
      <button id="menubutton" onClick={props.startGame}>NEW GAME</button>
      <span id="fullscreen">Use fullscreen (F11) for best experience </span>
    </div>
  )
}








export default Menu