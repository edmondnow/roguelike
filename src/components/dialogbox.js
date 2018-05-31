import React, { Component } from 'React';
import Typist from 'react-typist';

class DialogBox extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      currentText: 'Lorem ipsum dolor lerem switcher bean bag. Lorem ipsum dolor lerem switcher bean bag. Lorem ipsum dolor lerem switcher bean bag.',
      currentTitle: 'Pleblo El Mago'
    }

  }
  
  
  componentDidMount(){
    
  }

  render(){
    return (
      
      <div className="dialogbox">
        <div className="avatarDiv">
          <img src="./src/assets/goblin/avatar.png" id="avatar" alt="avatar" />
        </div>
        <div id="text-box">
          <div id="title">{ this.state.currentTitle }</div>
          <span id="dialog">
            <Typist cursor={{show: false}} startDelay={2000} avgTypingDelay={30}>
              { this.state.currentText }
            </Typist>
            </span>
        </div>
      </div>

    )
  }
}


export default DialogBox;