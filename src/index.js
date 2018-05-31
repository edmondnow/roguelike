import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StatusBar from './components/statusbar';
import DialogBox from './components/dialogbox';

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
    this.generateAsset = this.generateAsset.bind(this);
    this.dmg = this.dmg.bind(this);
    this.health = this.health.bind(this);
    this.attack = this.attack.bind(this);
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

   attack(body, enemy){
    console.log(enemy)
    enemy.sprite.animations.play('hit');
    enemy.sprite.animations.play('hitleft');
    setTimeout( ()=>{
      enemy.sprite.animations.play('idle')
      enemy.sprite.animations.play('idleleft')
    }, 700  )
    this.setState({ movement: false, health: this.state.health -10 });
    setTimeout( ()=>{
      this.setState({ movement: true })
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

      
  generateAsset(assets, game, charCG, otherCG, wallsCG){
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
        body.static = true;
        if(asset.name === 'potion')
          charBody.createBodyCallback(sprite, this.health, this)
        if(asset.name === 'sword')
          charBody.createBodyCallback(sprite, this.dmg, this)
        if(asset.type == 'monster'){
          sprite.animations.play('idle')
          sprite.animations.play('idleleft')
          charBody.createBodyCallback(sprite, this.attack, this)
        }
      }
      
      return asset;
    })

  }

  preload(){
    let { game } = this;
    let path = './src/assets';

    let char =  { name: 'char', variable: null, type: 'player', mode: 'atlas', quant:  1, path: `${path}/char/char`, debug: false,
        coordx: 160, coordy: 155, scale: 0.5, rect: {w: 15 , h: 7.5 , ox: -1, oy: 4, rotation: null }, anim: [
          { name: 'right' , count: 5 , fps: 9 },
          { name: 'left' , count: 5 , fps: 9 },
          { name: 'up' , count: 3 , fps: 9 },
          { name: 'down' , count: 3 , fps: 9 },
          { name: 'idle' , count: 2 , fps: 3 }
        ]
       }

    let skel =   { name: 'skel', variable: null, type: 'monster', mode: 'atlas', quant:  5, dmg: 10, health: 30, path: `${path}/skeleton/skeleton`, debug: false,
        coordx: null, coordy: null, scale: 0.9, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright' , count: 18 , fps: 9 },
          { name: 'dead', count: 15, fps: 9 },
          { name: 'hitleft', count: 8, fps: 10 },
          { name: 'hitright', count: 8, fps: 9 },
          { name: 'idleleft', count: 11, fps: 6 },
          { name: 'idleright', count: 11, fps: 6 },
          { name: 'reactleft', count: 4, fps: 9 },
          { name: 'reactright', count: 4, fps: 9 },
          { name: 'walkleft', count: 13, fps: 9 },
          { name: 'walkright', count: 13, fps: 9 }
        ]
      }

    let gob =  { name: 'gob', variable: null, type: 'monster', mode: 'atlas', quant: 5, dmg: 10, health: 30, path: `${path}/goblin/goblin`, debug: false,
        coordx: null, coordy: null, scale: 0.6, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright' , count: 7 , fps: 9 },
          { name: 'attackleft' , count: 7 , fps: 9 },
          { name: 'dead', count: 8 , fps: 9 },
          { name: 'hit', count: 3, fps: 5 },
          { name: 'idle', count: 3, fps: 3.5 },
          { name: 'left', count: 6, fps: 6 },
          { name: 'right', count: 6, fps: 6 },
        ]
       }
    
    let wiz =  { name: 'wiz', variable: null, type: 'monster', mode: 'atlas', quant:  3, dmg: 10, health: 30, path: `${path}/wizard/wizard`, debug: false,
        coordx: null, coordy: null, scale: 0.6, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright', count: 8 , fps: 9 },
          { name: 'attackleft' , count: 8 , fps: 9 },
          { name: 'dead', count: 10 , fps: 9 },
          { name: 'hit', count: 10, fps: 5 },
          { name: 'idle', count: 10, fps: 3 },
          { name: 'left', count: 6, fps: 6 },
          { name: 'right', count: 6, fps: 6 },
        ]
       }

    let hound =  { name: 'hound', variable: null, type: 'monster', mode: 'atlas', quant: 5, dmg: 10, health: 30, path: `${path}/hound/hound`, debug: false,
        coordx: null, coordy: null, scale: 0.7, rect: {w: 20 , h: 10 , ox: 0, oy: 7, rotation: null }, anim: [
          { name: 'attackleft', count: 6 , fps: 9 },
          { name: 'hitleft' , count: 3 , fps: 5 },
          { name: 'hitright', count: 3 , fps: 5 },
          { name: 'idleleft', count: 6, fps: 4 },
          { name: 'idleright', count: 6, fps: 3 },
          { name: 'walkleft', count: 12, fps: 6 },
          { name: 'walkright', count: 12, fps: 6 },

        ]
       }

    let potion = { name: 'potion', variable: null, type: 'item', mode: 'image', quant: 5, path: `${path}/potion`, debug: false,
        coordx: 190, coordy: 155, scale: 0.05, rect: {w: 7 , h: 7.5 , ox: -1, oy: 4, rotation: null }
      }
    
    let sword =  { name: 'sword', variable: null, type: 'item', mode: 'image', quant:  5, path: `${path}/sword`, debug: false,
        coordx: 180, coordy: 155, scale: 0.05, rect: {w: 5 , h: 7.5 , ox: -1, oy: 4, rotation: null },
      }

    //Specify all assets in an object to iterate over
    let assetUnique = [ skel, gob, wiz, hound, potion, sword]
    
    let assets = [char];

    function coordinateRange(coord){

      let coordsArray = [
        { minx: 7, miny: 7, maxx: 15, maxy: 12 }, 
        { minx: 36, miny: 8, maxx: 45, maxy: 11 }, 
        { minx: 32, miny: 22, maxx: 52, maxy: 22 },
        { minx: 32, miny: 29, maxx: 51, maxy: 29 }, 
        { minx: 2, miny: 19, maxx: 14, maxy: 28 }, 
      ]
      let coordPair = coordsArray[Math.floor(Math.random()*(5-0))]
      let { minx, miny, maxx, maxy } = coordPair;
      let r = 16; //resolution
      if(coord=='x') 
        return Math.ceil(Math.random() * (maxx - minx ) + minx) * r - 2;
      if(coord=='y')
        return Math.ceil(Math.random() * (maxy - miny ) + miny) * r - 2;
    }

    assetUnique.forEach(asset =>{
      let i = 0;
      let assetGroup = [];
      while( i < asset.quant){
        i ++;
        assetGroup.push(Object.assign({}, asset));
      }

      assetGroup.forEach(asset =>{
        asset.coordx = coordinateRange('x');
        asset.coordy = coordinateRange('y');
      })
      assets = [...assets, ...assetGroup];
    });


    console.log(assets)
   
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
    
    //Layer Generation with Asset Generator embedded
    layers = layers.map( layer => {
      layer.variable = map.createLayer(layer.name);
      if(layer.name === 'foregrounddetails')
        assets = this.generateAsset(assets, game, charCG, otherCG, wallsCG);
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
    let speed = 80 ;
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
          <div id="phaser-container"/>
          <DialogBox />
        </div>
    )
  }
}
  
ReactDOM.render(
  <div>
     <PhaserGame />
  </div>
  , document.querySelector('.container'));
