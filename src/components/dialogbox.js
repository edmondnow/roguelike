import React, { Component } from 'react';
import Typist from 'react-typist';


  
class DialogBox extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      currentDialog: null,
      currentText: null,
      currentTitle: null,
      nextAllow: false,
      startDelay: 2000,
      imgsrc: 'goblin',
      titles: { skeletonboss:'Boney Bob', wizardboss: 'Harry Urawizurd', houndboss: 'Toto', goblinboss: 'Griphook the Gobbler' },
      imgs: { skeletonboss: 'skeleton', wizardboss: 'wizard', goblinboss: 'goblin', houndboss: 'hound' },
      show: true,
      actorIt: 0,
      dialogIt: 1,
    }

    this.dialogControl = this.dialogControl.bind(this);
    this.resetDialog = this.resetDialog.bind(this);

  }
  
  dialogControl(e, dialog){
    let { imgs, titles, actorIt, dialogIt } = this.state;
    this.setState({startDelay: 0})
    var current = this.state.currentDialog;
    var selected = current[this.state.actorIt];


    if((e.keyCode==32&&this.state.nextAllow)){

     if(this.state.dialogIt===selected.say.length){
        actorIt++;
        if(this.state.actorIt===current.length){
          actorIt = 0;
          this.setState({actorIt: 0, dialogIt: 1})
        } else {
          this.setState({actorIt: actorIt, dialogIt: 1})
        }
     }
    
    if(this.state.actorIt>=current.length){
      this.setState({show: !this.state.show, actorIt: 0, dialogIt: 1});
      this.props.movementAllow();
      return;
    }

    selected = current[this.state.actorIt]
    var who = selected.who;
      this.setState({
        currentText: selected.say[this.state.dialogIt], 
        currentTitle: titles[who], 
        imgsrc: imgs[who],
        nextAllow: false, 
        dialogIt: this.state.dialogIt + 1
      })
    }
      
  }
    
  resetDialog(){
    this.setState({nextAllow: true})
  }
  
  componentDidUpdate(prevProps, prevState, snapshot){
    let encounters = {
      wizardboss: [{who: 'wizardboss', say: ['Hi, Player', 'Blabalablaba', 'Yaddaayayaya']}],
      goblinboss: [{who: 'goblinboss', say: ['Hi, Encounter', 'Blabalablaba', 'Yaddaayayaya']}],
      skeletonboss: [{who: 'skeletonboss', say: ['Hi, Encounter', 'Blabalablaba', 'Yaddaayayaya']}],
      houndboss: [{who: 'houndboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']}],
    }

    let deaths = {
      wizardboss: [{who: 'wizardboss', say: ["I'm dead", 'Blabalablaba', 'Yaddaayayaya']}],
      goblinboss: [{who: 'goblinboss', say: ["I'm dead", 'Blabalablaba', 'Yaddaayayaya']}],
      skeletonboss: [{who: 'skeletonboss', say: ["I'm dead", 'Blabalablaba', 'Yaddaayayaya']}],
      houndboss: [{who: 'houndboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']}],
    }
    
    if(prevProps.dead!=this.props.dead){
      this.setState({
      imgsrc: this.state.imgs[deaths[this.props.dead][0].who],
      currentDialog: deaths[this.props.dead],
      currentText: deaths[this.props.dead][0].say[0],
      currentTitle: this.state.titles[deaths[this.props.dead][0].who],
      show: true
      })
      this.props.movementDeny()
    }

  if(prevProps.encounter!=this.props.encounter){
      this.setState({
        imgsrc: this.state.imgs[encounters[this.props.encounter][0].who],
        currentDialog: encounters[this.props.encounter],
        currentText: encounters[this.props.encounter][0].say[0],
        currentTitle: this.state.titles[encounters[this.props.encounter][0].who],
        show: true
      })
      this.props.movementDeny()
    }

  }

  componentDidMount(){
    document.addEventListener("keydown", this.dialogControl, false)
    let initial = [
      {who: 'wizardboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      //{who: 'goblinboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      //{who: 'houndboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      //{who: 'skeletonboss', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']}
    ]
    this.setState({
      currentDialog: initial,
      currentText: initial[0].say[0],
      currentTitle: this.state.titles[initial[0].who],
      imgsrc: this.state.imgs[initial[0].who],
      show: true
      })
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.dialogControl, false)
  }

  render(){
    return (  
      <div className="dialogbox" onKeyDown={this.dialogControl} style={{visibility: this.state.show ? 'initial' : 'hidden'}}>
        <div className="avatarDiv">
          <img src= {`./src/assets/${this.state.imgsrc}/avatar.png`} id="avatar" alt="avatar" />
        </div>
        <div id="text-box">
          <div id="title">{ this.state.currentTitle }</div>
          <span id="dialog">
            <Typist 
            key={this.state.currentText}
            cursor={{show: false}} 
            onTypingDone={this.resetDialog}
            startDelay={this.state.startDelay} 
            avgTypingDelay={0}
            stdTypingDelay={0}>
              { this.state.currentText }
            </Typist>
            </span>
        </div>
      </div>
    )
  }
}


export default DialogBox;