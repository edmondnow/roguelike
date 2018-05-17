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
    game.load.image('player', './src/assets/player.png');
    
  }
  
  create(){
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
    //add player
        let foreground = map.createLayer('foreground');
    let foregroundDetails = map.createLayer('foregrounddetails');
    let player = game.add.sprite(160, 155, 'player');
    player.anchor.set(0.5, 0.5)

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
    player.body.fixedRotation = true; // no rotation
    player.body.collideWorldBounds = true;
    player.body.clearShapes();  
    //Only the lower part of the player collides
    player.body.addRectangle(7, 7, 0, 5)
    player.body.debug = true;
    //player.body.debug = true;
    //Export to class
    this.player = player;
    this.cursors  = cursors;
    this.map = map;
    this.foreground = foreground;

  }

  update(){
    let { player: { body }  } = this;
    let { cursors, game, player, foreground } = this;
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
