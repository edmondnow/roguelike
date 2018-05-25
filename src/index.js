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
    this.preload = this.preload.bind(this);
    this.assetGenerator = this.assetGenerator.bind(this);
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

    //Specify all assets in an object to iterate over
    let assets = [
      { name: 'char', variable: null, type: 'player', mode: 'atlas', path: `${path}/char/char`, debug: false,
        coordx: 160, coordy: 155, scale: 0.5, rect: {w: 15 , h: 7.5 , ox: -1, oy: 4, rotation: null }, anim: [
          { name: 'right' , count: 5 , fps: 9 },
          { name: 'left' , count: 5 , fps: 9 },
          { name: 'up' , count: 3 , fps: 9 },
          { name: 'down' , count: 3 , fps: 9 },
          { name: 'idle' , count: 2 , fps: 3 }
        ]
       },
      /*{ name: 'skel', variable: null, type: 'npc', mode: 'atlas', path: `${path}/skel/skel`, debug: true,
        coordx: 170, coordy: 160, scale: 1, rect: { w: 15, h: 7.5, ox: -1, oy: 4, rotation: null }, anim: [
          write animations here
        ]
      */
      { name: 'potion', variable: null, type: 'item', mode: 'image', path: `${path}/potion`, debug: true,
        coordx: 190, coordy: 155, scale: 0.05, rect: {w: 7 , h: 7.5 , ox: -1, oy: 4, rotation: null }
      },
      { name: 'sword', variable: null, type: 'item', mode: 'image', path: `${path}/sword`, debug: false,
        coordx: 180, coordy: 155, scale: 0.05, rect: {w: 5 , h: 7.5 , ox: -1, oy: 4, rotation: null },
      }
    ]
    this.assets = assets;
    

    // Load Map //
    game.load.image('DungeonTileset', `${path}/DungeonTileset.png`);
    game.load.image('WallTileset', `${path}/WallTileset.png`);
    game.load.tilemap('DungeonTilemap', `${path}/map.json`, null, Phaser.Tilemap.TILED_JSON);
      
    assets.forEach( asset =>{
      let { name, type, mode, path } = asset;
      // Load Charachters //
      if (mode == 'atlas')
        game.load.atlasJSONHash(name, `${path}.png`,  `${path}.json`)
      if (mode == 'image')
        game.load.image(name, `${path}.png`);
    })
    
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

      
  assetGenerator(assets, game, charCG, otherCG, wallsCG){
    let charBody;

    return assets.map(asset => {
      
      let {coordx, coordy, name } = asset;
      let sprite = game.add.sprite(coordx, coordy, name);
      asset.variable = sprite;
      game.physics.p2.enable(sprite);
      sprite.scale.setTo(asset.scale, asset.scale)
      sprite.anchor.setTo(.5,.5);
      
      let { body, animations } = sprite;

      // Charachter Body Config
      body.fixedRotation = true; // no rotation
      body.collideWorldBounds = true;
      body.clearShapes(); 
      body.damping = 0.99;
      body.addRectangle(asset.rect.w, asset.rect.h, asset.rect.ox, asset.rect.oy)
      body.debug = asset.debug;
      
      //Add Animations
      if(asset.anim){
        asset.anim.forEach( anim => {
          animations.add( 
            anim.name, 
            Phaser.Animation.generateFrameNames( `${anim.name}/tile`, 0, anim.count, '.png', 3), 
            anim.fps,
            true,
            false
          );
        });
      }
      

      if(asset.name == 'char'){
        charBody = body;
        charBody.setCollisionGroup(charCG);
        charBody.collides(otherCG);
        charBody.collides(wallsCG);
      } else {
        body.setCollisionGroup(otherCG);
        body.collides(charCG);
        if(asset.name == 'potion')
          body.createBodyCallback(asset.variable, this.health,this)
        if(asset.name == 'sword')
          body.createBodyCallback(asset.variable, this.dmg, this)
      }
      
      return asset;
    })

  }
  
  create(){
    let { game, assets } = this;
    let wallCollisions = game.add.tilemap('DungeonTilemap')
    let physicsTiles = [];

    let layers = [ 
      { name: 'background', collision: false, variable: null }, 
      { name: 'backgrounddetails', collision: true, variable: null  },
      { name: 'floor', collision: false, variable: null  },
      { name: 'floordetails', collision: false, variable: null  },
      { name: 'foreground', collision: true, variable: null  },
      { name: 'foregrounddetails', collision: true, variable: null  },
      { name: 'foregroundtops', collision: false, variable: null  }
    ];
 
    // Config Layer, Map and Stage //
    game.stage.backgroundColor = '#2d2d2d';
    let map = game.add.tilemap('DungeonTilemap');
    map.addTilesetImage('DungeonTileset', 'DungeonTileset');
    map.addTilesetImage('WallTileset', 'WallTileset');
    
    // Enable Physics //
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = this.state.restitution;

    // Set Collision Groups // 
    let charCG = game.physics.p2.createCollisionGroup();
    let otherCG = game.physics.p2.createCollisionGroup();
    let wallsCG = game.physics.p2.createCollisionGroup();
    
    //Layer Generation with Asset Generator embeded inbetween
    layers = layers.map( layer => {
      if(layer.name === 'foreground')
          assets = this.assetGenerator(assets, game, charCG, otherCG, wallsCG);
      layer.variable = map.createLayer(layer.name);
      if(layer.collision){
        map.setCollisionBetween(1, 999, true, layer.name);
        let tiles = game.physics.p2.convertTilemap(map, layer.name);
        tiles.forEach(tile=>{
          tile.setCollisionGroup(wallsCG);
          tile.collides(charCG);
          tile.collides(otherCG);
        }) 
      }

      return layer
    });
    


  //  Export to class //
    this.char = assets[0].variable;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.map = map;

  }

  update(){
    let speed = 80;
    let { char: { body }  } = this;
    let { cursors, game, char } = this;
    
    if(this.state.movement){
      body.velocity.y = 0;
      body.velocity.x = 0;
      if (cursors.left.isDown){
        body.moveLeft(speed);
        char.animations.play('left');
      } else if(cursors.right.isDown){
        body.moveRight(speed);
        char.animations.play('right');
      } if (cursors.up.isDown){
        body.moveUp(speed);
        char.animations.play('up');
      } else if(cursors.down.isDown){
        body.moveDown(speed);
       char.animations.play('down');
      } else if (cursors.down.isUp && cursors.up.isUp && cursors.left.isUp && cursors.right.isUp){
        char.animations.play('idle');
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


//things I commented out  
  //goblinBody.setZeroVelocity();
  //char.body.collides(itemCG, collect, this)
