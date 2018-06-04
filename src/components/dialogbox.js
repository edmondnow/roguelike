import React, { Component } from 'React';
import Typist from 'react-typist';

class DialogBox extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      currentText: 'Lorem ipsum dolor lerem switcher bean bag. Lorem ipsum dolor lerem switcher bean bag. Lorem ipsum dolor lerem switcher bean bag.',
      currentTitle: 'Pleblo El Mago',
      imgsrc: 'goblin',
      titles: { brains:'NoBrains CereBro', pleblo: 'Pleblo ElMago', jdog: 'J-Dog the HellHound', ednerd: 'Ednerd Gobbler' },
      plebloalive: true,
      ednerdalive: true,
      jdogalive: true,
      brainsalive: true,
      avgTypingDelay: 30,
      stdTypingDelay: 25,
      show: true,

    }

    this.increaseTypingDelay = this.increaseTypingDelay.bind(this);
    this.resetTypingDelay = this.resetTypingDelay.bind(this);

  }
  
  increaseTypingDelay(e){
    if(e.keyCode===32)
      this.setState({avgTypingDelay: 0, stdTypingDelay: 0})
    console.log(this.state.avgTypingDelay)
  }
  
  
  resetTypingDelay(){
    this.setState({avgTypingDelay: 30, stdTypingDelay: 25})
  }

  componentDidMount(){
    document.addEventListener("keydown", this.increaseTypingDelay, false)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.increaseTypingDelay, false)
  }

  render(){
    return (
      
      <div className="dialogbox" onKeyDown={this.increaseTypingDelay} style={{display: this.state.show ? 'flex' : 'none'}}>
        <div className="avatarDiv">
          <img src= {`./src/assets/${this.state.imgsrc}/avatar.png`} id="avatar" alt="avatar" />
        </div>
        <div id="text-box">
          <div id="title">{ this.state.currentTitle }</div>
          <span id="dialog">
            <Typist 
            cursor={{show: false}} 
            onTypingDone={this.resetTypingDelay}
            startDelay={2000} 
            avgTypingDelay={this.state.avgTypingDelay}
            stdTypingDelay={this.state.stdTypingDelay}>
              { this.state.currentText }
            </Typist>
            </span>
        </div>
      </div>

    )
  }
}


export default DialogBox;