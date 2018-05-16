import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component{
  constructor(props){
    super(props)
    
    this.create = this.create.bind(this);
    this.update = this.update.bind(this)
  }

  componentDidMount(){
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, "phaser-container", 
        { 
          create: this.create,
          update: this.update
,          preload: this.preload
        }
   );
  }

  preload(){
    let { game } = this;
    game.load.image('cat', './src/assets/cat.png');
    game.load.image('tiles', './src/assets/tmw_desert_spacing.png');
    game.load.tilemap('desert', './src/assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    
  }
  
  create(){
    let { game } = this;
    let cursors = game.input.keyboard.createCursorKeys();

    let map = game.add.tilemap('desert');
    let layer = map.createLayer('Ground');
    let cat = game.add.sprite(450, 80, 'cat');
    
    //Physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;
    game.physics.p2.enable(cat);
    game.camera.follow(cat);

    //Cat
    cat.scale.setTo(1, 1)
    cat.body.setZeroDamping();
    cat.body.fixedRotation = true;
    cat.anchor.setTo(0.5, 0.5);

    //Layers, map and stage
    game.stage.backgroundColor = '#2d2d2d';
    map.addTilesetImage('Desert', 'tiles');
    layer.resizeWorld();
    //Export to class
    this.cat = cat;
    this.cursors  = cursors;
    this.map = map;
  }

  update(){
    let { body } = this.cat;
    let cursors = this.cursors;
    body.setZeroVelocity();

    if (cursors.left.isDown)
      body.moveLeft(400);
    else if (cursors.right.isDown)
      body.moveRight(400);
    if (cursors.up.isDown)
      body.moveUp(400);
    else if (cursors.down.isDown)
      body.moveDown(400);
  }

  render(){
    return(
        <div></div>
    )
  }

}


  



ReactDOM.render(
  <div>
     <App />
  </div>

  , document.querySelector('.container'));
