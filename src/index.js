import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component{
  constructor(props){
    super(props)
    
    this.create = this.create.bind(this);
    this.update = this.update.bind(this)
  }

  componentDidMount(){
    this.game = new Phaser.Game(960, 576, Phaser.AUTO, "phaser-container", 
        { 
          create: this.create,
          update: this.update
,          preload: this.preload
        }
   );
  }

  preload(){
    let { game } = this;
    game.load.image('DungeonTileset', './src/assets/DungeonTileset.png');
    game.load.image('WallTileset', './src/assets/WallTileset.png');
    game.load.tilemap('DungeonTilemap', './src/assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.image('player', './src/assets/player.png');
   //game.load.spritesheet('player', './src/assets/player.png',36, 44);
    game.load.atlasJSONHash('player', './src/assets/player.png', './src/assets/player.json');
    // game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    
  }
  
  create(){
    let fps = 12;
    let { game } = this;
    let cursors = game.input.keyboard.createCursorKeys();


    



    //Layers, map and stage
    game.stage.backgroundColor = '#2d2d2d';

    let map = game.add.tilemap('DungeonTilemap');
    map.addTilesetImage('DungeonTileset', 'DungeonTileset');
    map.addTilesetImage('WallTileset', 'WallTileset');
    let background = map.createLayer('background');
    let backgroundDetails = map.createLayer('backgrounddetails');
    let floor = map.createLayer('floor'); 
    let floorDetails = map.createLayer('floordetails');
    
    let foreground = map.createLayer('foreground');
    let foregroundDetails = map.createLayer('foregrounddetails');
    //add player
    let player = game.add.sprite(160, 155, 'player', 'idle/0.png');
    

    let foregroundTops = map.createLayer('foregroundtops');
    background.resizeWorld();
    //Physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    map.setCollisionBetween(1, 999, true, "foreground");
    map.setCollisionBetween(1, 999, true, "foregrounddetails");
    map.setCollisionBetween(1, 999, true, "backgrounddetails")
    game.physics.p2.convertTilemap(map, "foreground");
    game.physics.p2.convertTilemap(map, "foregrounddetails");
    game.physics.p2.convertTilemap(map, "backgrounddetails");

    //player
    
    game.physics.p2.enable(player);
    player.animations.add('right', Phaser.Animation.generateFrameNames('right/', 0, 5, '.png', 1), fps, true, false);
    player.animations.add('left', Phaser.Animation.generateFrameNames('left/', 0, 5, '.png', 1), fps, true, false);
    player.animations.add('up', Phaser.Animation.generateFrameNames('up/', 0, 3, '.png', 1), fps, true, false);
    player.animations.add('down', Phaser.Animation.generateFrameNames('down/', 0, 3, '.png', 1), fps, true, false);
    player.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 2, '.png', 1), fps-6, true, false);
    player.body.fixedRotation = true; // no rotation
    player.body.collideWorldBounds = true;
    player.body.clearShapes(); 
    player.scale.setTo(0.5, 0.5)
    player.anchor.setTo(.5,.5);
    //Only the lower part of the player collides
    player.body.addRectangle(10, 6, -1, 4)
    // /player.body.debug = true;
    //Export to class
    this.player = player;
    this.cursors  = cursors;
    this.map = map;
    this.foreground = foreground;

  }

  update(){

    let speed = 80;
    let { player: { body }  } = this;
    let { cursors, game, player, foreground } = this;
    body.setZeroVelocity();

    if (cursors.left.isDown){
      body.moveLeft(speed);
      player.animations.play('left');
    }  else if(cursors.right.isDown){
      body.moveRight(speed);
      player.animations.play('right');
    } if (cursors.up.isDown){
      body.moveUp(speed);
      player.animations.play('up');
    }  else if(cursors.down.isDown){
      body.moveDown(speed);
      player.animations.play('down');
    } else if (cursors.down.isUp && cursors.up.isUp && cursors.left.isUp && cursors.right.isUp){
        player.animations.play('idle');
    }
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
