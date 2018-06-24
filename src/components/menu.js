import React, { Component } from 'react';

let Menu = props =>{
  let defaultText = 'Use your <img id="arrows" src="./src/assets/arrows.png" alt="arrows" /> and bump into monsters!';
  let winText = "You've been dismembered!";
  let loseText = 'You obliterated everyone!';
  return(
    <div id="menu"> 
      <img id="bakery" src="./src/assets/roguecraft.png" alt="BAKERYCRAFT" />
      { props.win!=undefined ? 
        (props.win==true ? <div id="ins" dangerouslySetInnerHTML={{__html: loseText}} /> :  <div id="ins" dangerouslySetInnerHTML={{__html: winText}} />): 
      <div id="ins" dangerouslySetInnerHTML={{__html: defaultText}} /> }
      <button id="menubutton" onClick={props.startGame}>{props.win!=undefined ? 'RELOAD' : 'NEW GAME'}</button>
      <span id="fullscreen">Use fullscreen (F11) for best experience </span>
    </div>
  )
}








export default Menu