import React, { Component } from 'React';
import Typist from 'react-typist';


  
class DialogBox extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      currentText: null,
      currentTitle: null,
      nextAllow: false,
      startDelay: 2000,
      imgsrc: 'goblin',
      titles: { brains:'NoBrains CereBro', pleblo: 'Pleblo ElMago', jdog: 'J-Dog the HellHound', ednerd: 'Ednerd Gobbler' },
      imgs: { brains: 'skeleton', pleblo: 'wizard', ednerd: 'goblin', jdog: 'hound' },
      plebloalive: true,
      ednerdalive: true,
      jdogalive: true,
      brainsalive: true,
      show: true,
      actorIt: 0,
      dialogIt: 0,

    }

    this.dialogControl = this.dialogControl.bind(this);
    this.resetDialog = this.resetDialog.bind(this);

  }
  
  dialogControl(e){
    let { imgs, titles, actorIt, dialogIt } = this.state;
    this.setState({startDelay: 0})
    let initial = [
      {who: 'pleblo', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      {who: 'ednerd', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      {who: 'jdog', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
      {who: 'brains', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']}
    ]

    let plebloEncounter = [
      {who: 'pleblo', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
    ]

    let plebloDead = [
        {who: 'pleblo', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
    ]


    let jdogEncounter = [
        {who: 'pleblo', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
    ]


    let jdogDead = [
        {who: 'pleblo', say: ['Hi, Marty', 'Blabalablaba', 'Yaddaayayaya']},
    ]


    var current = initial;

    var selected = current[this.state.actorIt];

    

    if(e.keyCode==32&&this.state.nextAllow){

     if(this.state.dialogIt===selected.say.length){
        actorIt++;
        if(this.state.actorIt===current.length){
          actorIt = 0;
          this.setState({actorIt: 0, dialogIt: 0})
        } else {
          this.setState({actorIt: actorIt, dialogIt: 0})
          
        }
        
     }
    
    if(this.state.actorIt>=current.length){
      this.setState({show: !this.state.show, actorIt: 0, dialogIt: 0});
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

  componentWillReceiveProps(){
   
  }

  componentDidMount(){
    document.addEventListener("keydown", this.dialogControl, false)
    this.setState({currentTitle: 'oooooooooooooooooo', currentText: 'brrrrrrrrrrrrr' })
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