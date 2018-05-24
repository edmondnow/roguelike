import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StatusBar from './components/statusbar';

class PhaserGame extends Component{
  constructor(props){
    super(props)
    let path = './src/assets';

    this.state = {
      movement: true,
      health: 100,
      xp: 0,
      lvl: 1,
      dmg: 10,
      weapon: `${path}/sword.png`,
      restitution: 3,

    }
    
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    //this.dmg = this.dmg.bind(this);
  }

  componentDidMount(){
    this.game = new Phaser.Game(960, 576, Phaser.AUTO, "phaser-container", 
        { 
          create: this.create,
          update: this.update,
          preload: this.preload
        }
   );
  }

  preload(){
    let { game } = this;
    let path = './src/assets';

    // Load Map //
    game.load.image('DungeonTileset', `${path}/DungeonTileset.png`);
    game.load.image('WallTileset', `${path}/WallTileset.png`);
    game.load.tilemap('DungeonTilemap', `${path}/map.json`, null, Phaser.Tilemap.TILED_JSON);

    // Load Charachters //
    game.load.atlasJSONHash('player', `${path}/char/char.png`, `${path}/char/char.json`);
    game.load.atlasJSONHash('skel', `${path}/skeleton/skeleton.png`, `${path}/skeleton/skeleton.json`);
    game.load.atlasJSONHash('goblin', `${path}/goblin/goblin.png`, `${path}/goblin/goblin.json`);
    game.load.image('potion', `${path}/potion.png`);
    game.load.image('sword', `${path}/sword.png`);
    
  }

   attack(body, enemy){
    enemy.sprite.animations.play('hit');
    setTimeout(()=>{
      enemy.sprite.animations.play('idle')
    }, 700  )
    this.setState({movement: false, health: this.state.health -10});
    setTimeout(()=>{
      this.setState({movement: true})
    }, 500)
      console.log(this.state.health)
  }

  health(body, potion){
    body.velocity.x = 0;
    body.velocity.y = 0;
    potion.sprite.kill();
    this.setState({health: this.state.health + 10});
    console.log(this.state.health)
  }

  dmg(body, weapon){
    body.velocity.x = 0;
    body.velocity.y = 0;
    weapon.sprite.kill();
    this.setState({attack: this.state.dmg + 10});
    console.log(this.state.dmg);
  }

  
  create(){
    let fps = 12;
    let { game } = this;
    let cursors = game.input.keyboard.createCursorKeys();

    //  Helper Functions //
 
    // Config Layer, Map and Stage //
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
    
    let wallCollisions = game.add.tilemap('DungeonTilemap')

    // Add Charachters to Between Layers //
    let player = game.add.sprite(160, 155, 'player');
    let goblin = game.add.sprite(180, 155, 'goblin');
    let potion = game.add.sprite(180, 190, 'potion');
    let sword = game.add.sprite(180, 210, 'sword');
    let skel = game.add.sprite(130, 190, 'skel')

    let foregroundTops = map.createLayer('foregroundtops');
    background.resizeWorld();

    // Physics //
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = this.state.restitution;
    map.setCollisionBetween(1, 999, true, "foreground");
    map.setCollisionBetween(1, 999, true, "foregrounddetails");
    map.setCollisionBetween(1, 999, true, "backgrounddetails")
    let foregroundTiles = game.physics.p2.convertTilemap(map, "foreground");
    let foregroundDetailsTiles = game.physics.p2.convertTilemap(map, "foregrounddetails");
    let backgrounDetailsTiles = game.physics.p2.convertTilemap(map, "backgrounddetails");
    map.layers.forEach(layer =>{
      layer = {x: 1, y: 1}
      
    })
    let physicsTiles = [...foregroundTiles, ...foregroundDetailsTiles, ...backgrounDetailsTiles]

    // Set Collision Groups // 
    let playerCG = game.physics.p2.createCollisionGroup();
    let monstCG = game.physics.p2.createCollisionGroup();
    let wallsCG = game.physics.p2.createCollisionGroup();
    let itemCG = game.physics.p2.createCollisionGroup();

    
    // Enable Physics per Charachter //
    game.physics.p2.enable(player);
    game.physics.p2.enable(goblin);
    game.physics.p2.enable(potion);
    game.physics.p2.enable(sword);
    game.physics.p2.enable(skel);


    // Add Animations per Charachter //
    player.animations.add('right', Phaser.Animation.generateFrameNames('right/tile', 0, 5, '.png', 3), fps, true, false);
    player.animations.add('left', Phaser.Animation.generateFrameNames('left/tile', 0, 5, '.png', 3), fps, true, false);
    player.animations.add('up', Phaser.Animation.generateFrameNames('up/tile', 0, 3, '.png', 3), fps, true, false);
    player.animations.add('down', Phaser.Animation.generateFrameNames('down/tile', 0, 3, '.png', 3), fps, true, false);
    player.animations.add('idle', Phaser.Animation.generateFrameNames('idle/tile', 0, 2, '.png', 3), fps-6, true, false);
    skel.animations.add('idle', Phaser.Animation.generateFrameNames('idle/tile', 0, 10, '.png', 3), fps-6, true, false);
    skel.animations.add('hit', Phaser.Animation.generateFrameNames('hit/tile', 0, 7, '.png', 3), fps-2, true, false);
    skel.animations.play('idle');
    // Charachter Body Config
    player.body.fixedRotation = true; // no rotation
    player.body.collideWorldBounds = true;
    player.body.clearShapes(); 
    player.body.damping = 0.99;
    player.scale.setTo(0.8,0.8)
    //player.anchor.setTo(.5,.5);
    player.body.addRectangle(15, 7.5, -1, 4)
    //player.body.debug = true;


    goblin.body.fixedRotation = true; // no rotation
    goblin.body.collideWorldBounds = true;
    goblin.body.clearShapes();
    goblin.scale.setTo(0.05, 0.05)
    goblin.anchor.setTo(.5,.5);
    goblin.body.addRectangle(15, 7.5, -1, 4)
    
    skel.body.fixedRotation = true; // no rotation
    skel.body.collideWorldBounds = true;
    skel.body.clearShapes();
    skel.scale.setTo(1.2, 1.2)
    skel.anchor.setTo(.5,.5);
    skel.body.addRectangle(15, 7.5, -1, 4)


    potion.body.fixedRotation = true; // no rotation
    potion.body.collideWorldBounds = true;
    potion.body.clearShapes();
    potion.scale.setTo(0.05, 0.05)
    potion.anchor.setTo(.5,.5);
    potion.body.addRectangle(15, 7.5, -1, 4)
    

    sword.body.fixedRotation = true; // no rotation
    sword.body.collideWorldBounds = true;
    sword.body.clearShapes();
    sword.scale.setTo(0.05, 0.05)
    sword.anchor.setTo(.5,.5);
    sword.body.addRectangle(15, 7.5, -1, 4)


    // Set Collision Interaction //
    physicsTiles.forEach(tile=>{
      tile.setCollisionGroup(wallsCG);
      tile.collides(playerCG);
      tile.collides(monstCG);
    }) 

    player.body.setCollisionGroup(playerCG);
    goblin.body.setCollisionGroup(monstCG);
    skel.body.setCollisionGroup(monstCG)
    potion.body.setCollisionGroup(itemCG);
    sword.body.setCollisionGroup(itemCG);
    player.body.collides(monstCG);
    player.body.collides(wallsCG);
    player.body.collides(itemCG)
    goblin.body.collides(playerCG);
    potion.body.collides(playerCG);
    sword.body.collides(playerCG);
    skel.body.collides(playerCG);

    //bodies
    potion.body.static = true;
    skel.body.static = true;
    //item collissiong group
    //player.body.collides(itemCG, collect, this);
    player.body.createBodyCallback(goblin, this.attack, this)
    player.body.createBodyCallback(potion, this.health, this)
    player.body.createBodyCallback(sword, this.dmg, this)
    player.body.createBodyCallback(skel, this.attack, this)

    //  Export to class //
    this.player = player;
    this.cursors  = cursors;
    this.map = map;
    this.foreground = foreground;
    this.goblin = goblin;
    this.skel = skel;

  }

  update(){

    let speed = 80;
    let { player: { body }  } = this;
    let goblinBody = this.goblin.body;
    let skelBody = this.skel.body;
    goblinBody.static = true;
    skelBody.static.true;
    let { cursors, game, player, foreground } = this;
    
    //goblinBody.setZeroVelocity();
    
    if(this.state.movement){
      body.velocity.y = 0;
      body.velocity.x = 0;
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
    
  }

  render(){
    return(

        <div>
          <StatusBar props={this.state}/>
        </div>
    )
  }

}


  



ReactDOM.render(
  <div>
     <PhaserGame />
  </div>

  , document.querySelector('.container'));
