import React, { Component } from 'react' ;
import ReactDOM from 'react-dom';
import StatusBar from './components/statusbar.js';
import DialogBox from './components/dialogbox.js';
import MenuBar from './components/menu';

class PhaserGame extends Component{
  constructor(props){
    super(props)
    let path = './src/assets';

    this.state = {
      movement: false,
      health: 100,
      xp: 0,
      xpthreshold: 100,
      lvl: 1,
      dmg: 10,
      weapon: `${path}/sword.png`,
      lights: true,
      gamestart: false,
      wizardboss: true,
      goblinboss: true,
      houndboss: true,
      skeletonboss: true,
      encounter: null,
      dead: null,
      allcoords: []
    }
    

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.preload = this.preload.bind(this);
    this.generateAsset = this.generateAsset.bind(this);
    this.dmg = this.dmg.bind(this);
    this.health = this.health.bind(this);
    this.attack = this.attack.bind(this);
    this.lightSwitch = this.lightSwitch.bind(this);
    this.startGame = this.startGame.bind(this);
    this.movementAllow = this.movementAllow.bind(this);
    this.movementDeny = this.movementDeny.bind(this);
    this.coordinateRange = this.coordinateRange.bind(this);
    this.noVelocity = this.noVelocity.bind(this)
  }

 
  movementAllow(){
    this.setState({movement: true})
  }

  movementDeny(){
    this.setState({movement: false})
  }
  
  lightSwitch(){
    this.setState({lights: !this.state.lights})
  }

  attack(player, enemy){

    this.setState({ movement: false, health: this.state.health - enemy.sprite.dmg });
    setTimeout( ()=>{
      this.setState({ movement: true })
    }, 500)

    let { cursors } = this;
    if(enemy.sprite.hp > 0){
      enemy.sprite.animations.play('hit');
      enemy.sprite.animations.play('hitleft');
    }
    
    
    if (cursors.left.isDown){
      player.sprite.animations.play('attackleft')
    } else if(cursors.right.isDown){
      player.sprite.animations.play('attackright')
    } if (cursors.up.isDown){
      player.sprite.animations.play('attackup')
    } else if(cursors.down.isDown){
      player.sprite.animations.play('attackdown')
    } 
  

    setTimeout( ()=>{
      enemy.sprite.animations.play('idle')
      enemy.sprite.animations.play('idleright')
    }, 700  )
    enemy.sprite.hp -= this.state.dmg;
    if(enemy.sprite.hp <= 0){
        enemy.sprite.dmg = 0;
        this.setState({ xp: this.state.xp + enemy.sprite.xp })
        enemy.sprite.animations.play('dead')
        if(enemy.sprite.boss!=undefined){
          this.setState({[enemy.sprite.boss]: false, dead: enemy.sprite.boss});
        }
        setTimeout(()=>{
          enemy.sprite.kill();
        }, 600)
      }
  
    if(this.state.xp>=this.state.xpthreshold){
      let remainder = this.state.xp % this.state.xpthreshold
      this.setState({lvl: this.state.lvl + 1, xp: remainder, xpthreshold: this.state.xpthreshold + 50, dmg: this.state.dmg + 20})
    }


  }

  startGame(){

    
    if(this.state.gamestart){
      window.location.reload();
    } else {
    this.game = new Phaser.Game(960, 576, Phaser.AUTO, "phaser-container", 
        { 
          create: this.create,
          update: this.update,
          preload: this.preload
        }
      );
    }

    this.setState({
      gamestart: true, 
    }) 

  }


  updateShadowTexture(){
    if(!this.state.lights){
      this.lightSprite.visible = false;
      return;
    }
  
    this.lightSprite.reset(this.game.camera.x - 10, this.game.camera.y - 10);
    var mc = this.char.body.sprite
    var ctx = this.shadowTexture.context;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.game.width + 20, this.game.height + 20);
    
    var x = mc.x - this.game.camera.x + 20, y = mc.y - this.game.camera.y + 20;
    var gradient = ctx.createRadialGradient(
      x, y, 100 * 0.75,
      x, y, 100
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, 100, 0, Math.PI*2);
    ctx.fill();
    
    this.shadowTexture.dirty = true;
  }

  checkPos(){
    let p = 65; //proximity
    let { x, y } = this.char.body.sprite
    x = Math.floor(x);
    y = Math.floor(y);
    let bossCoordinates = [
    { name: 'goblinboss', x:390, y:45 },
    { name: 'wizardboss', x:136, y:360 },
    { name: 'skeletonboss', x:580, y:400 },
    { name: 'houndboss', x:650, y:150 },
     ]
    bossCoordinates.forEach(coord =>{
      if((x>coord.x-p&&x<coord.x + p)&&(y>coord.y-p&&y<coord.y + p)){
       if(this.state[coord.name]&&this.state.encounter!=coord.name){
        this.setState({encounter: coord.name, [coord.name]: false});
        this.char.animations.play('idle');
       }
      }
    });

    
  }

  health(body, potion){
    body.velocity.x = 0;
    body.velocity.y = 0;
    potion.sprite.kill();
    this.setState({health: this.state.health + 30});
  }

  dmg(body, weapon){
    body.velocity.x = 0;
    body.velocity.y = 0;
    weapon.sprite.kill();
    this.setState({dmg: this.state.dmg + 5});
  }

  coordinateRange(){
    
    let coordsArray = [
      { minx: 7, miny: 7, maxx: 15, maxy: 12 }, 
      { minx: 36, miny: 8, maxx: 45, maxy: 11 }, 
      { minx: 32, miny: 22, maxx: 52, maxy: 22 },
      { minx: 32, miny: 29, maxx: 51, maxy: 29 }, 
      { minx: 2, miny: 19, maxx: 14, maxy: 28 }, 
    ]

    function returnRandom(){
      newCoords.x =  Math.floor(Math.random() * (maxx - minx ) + minx) * r - 2;
      newCoords.y = Math.floor(Math.random() * (maxy - miny ) + miny) * r - 2;
    }

    var close = false; 

    let coordPair = coordsArray[Math.floor(Math.random()*(5-0))]
    let { minx, miny, maxx, maxy } = coordPair;
    let r = 16; //resolution
    let newCoords = {};
    returnRandom();


    var remake = () => {
      close = this.state.allcoords.forEach(coord =>{
        if(coord.x%newCoords.x<64||coord.y%newCoords.y<64){
            returnRandom();
            return true
        }

        return false 
      })
    }

    
    while(close){
      remake();
    }

    remake();

    this.setState({allcoords: [...this.state.allcoords, newCoords]});
    return newCoords
  }

  noVelocity(body, tile){
    
    body.velocity.x = 0;
    body.velocity.y = 0;
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
      if(asset.type === "monster"){
          sprite.hp = asset.hp;
          sprite.dmg = asset.dmg;
          sprite.xp = asset.xp;
        if(asset.boss != undefined){
          sprite.boss = asset.boss;
        }
      }
      let { body, animations } = sprite;

      // Charachter Body Config
      body.fixedRotation = true; // no rotation
      body.collideWorldBounds = true;
      body.clearShapes(); 
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
        charBody.damping = 0.99
        charBody.sprite.animations.play('idle');

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
          sprite.animations.play('idleright')
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
          { name: 'idle' , count: 2 , fps: 3 },
          { name: 'attackdown' , count: 4 , fps: 8 },
          { name: 'attackup' , count: 4 , fps: 8 },
          { name: 'attackleft' , count: 4 , fps: 8 },
          { name: 'attackright' , count: 4 , fps: 8 },

        ]
       }

    let skel =   { name: 'skel', variable: null,  boss: undefined, type: 'monster', mode: 'atlas', quant:  5, dmg: 15, hp: 60, path: `${path}/skeleton/skeleton`, debug: false,
        coordx: null, xp: 30, coordy: null, scale: 0.9, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright' , count: 18 , fps: 9 },
          { name: 'dead', count: 15, fps: 16 },
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

    let gob =  { name: 'gob', xp: 15, boss: undefined, variable: null, type: 'monster', mode: 'atlas', quant: 10, dmg: 10, hp: 30, path: `${path}/goblin/goblin`, debug: false,
        coordx: null, coordy: null, scale: 0.6, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright' , count: 7 , fps: 9 },
          { name: 'attackleft' , count: 7 , fps: 9 },
          { name: 'dead', count: 8 , fps: 10 },
          { name: 'hit', count: 3, fps: 5 },
          { name: 'idle', count: 3, fps: 3.5 },
          { name: 'left', count: 6, fps: 6 },
          { name: 'right', count: 6, fps: 6 },
        ]
       }
    
    let wiz =  { name: 'wiz', xp: 30, variable: null, boss: undefined, type: 'monster', mode: 'atlas', quant:  5, dmg: 15, hp: 60, path: `${path}/wizard/wizard`, debug: false,
        coordx: null, coordy: null, scale: 0.6, rect: {w: 10 , h: 18 , ox: 0, oy: 0, rotation: null }, anim: [
          { name: 'attackright', count: 8 , fps: 9 },
          { name: 'attackleft' , count: 8 , fps: 9 },
          { name: 'dead', count: 10 , fps: 11 },
          { name: 'hit', count: 10, fps: 5 },
          { name: 'idle', count: 10, fps: 3 },
          { name: 'left', count: 6, fps: 6 },
          { name: 'right', count: 6, fps: 6 },
        ]
       }

    let hound =  { name: 'hound', xp: 30,  boss: undefined, variable: null, type: 'monster', mode: 'atlas', quant: 5, dmg: 15, hp: 60, path: `${path}/hound/hound`, debug: false,
        coordx: null, coordy: null, scale: 0.7, rect: {w: 20 , h: 10 , ox: 0, oy: 7, rotation: null }, anim: [
          { name: 'attackleft', count: 6 , fps: 9 },
          { name: 'hitleft' , count: 3 , fps: 5 },
          { name: 'dead' , count: 9 , fps: 11 }, 
          { name: 'hitright', count: 3 , fps: 5 },
          { name: 'idleleft', count: 6, fps: 4 },
          { name: 'idleright', count: 6, fps: 3 },
          { name: 'walkleft', count: 12, fps: 6 },
          { name: 'walkright', count: 12, fps: 6 },

        ]
       }

    let potion = { name: 'potion', variable: null, type: 'item', mode: 'image', quant: 10, path: `${path}/potion`, debug: false,
        coordx: 190, coordy: 155, scale: 0.8, rect: {w: 7 , h: 7.5 , ox: -1, oy: 4, rotation: null }
      }
    
    let sword =  { name: 'sword', variable: null, type: 'item', mode: 'image', quant:  5, path: `${path}/sword`, debug: false,
        coordx: 180, coordy: 155, scale: 1, rect: {w: 5 , h: 7.5 , ox: -1, oy: 4, rotation: null },
      }

    //Specify all assets in an object to iterate over
    let assetUnique = [ potion, sword, skel, gob, wiz, hound ]
    
    let skeletonboss =  Object.assign({}, skel);
    skeletonboss.scale = 1.2;
    skeletonboss.coordx = 580;
    skeletonboss.hp = 220;
    skeletonboss.dmg = 30;
    skeletonboss.xp = 70;
    skeletonboss.coordy = 400;
    skeletonboss.rect.ox = -5;
    skeletonboss.rect.oy = +10;
    skeletonboss.boss = 'skeletonboss'

    let goblinboss = Object.assign({}, gob);

    goblinboss.scale = 0.8;
    goblinboss.hp = 220;
    goblinboss.dmg = 30;
    goblinboss.xp = 70;
    goblinboss.coordx = 390;
    goblinboss.coordy = 45;
    goblinboss.rect.ox = 0;
    goblinboss.rect.oy = 2;
    goblinboss.boss = 'goblinboss';

    let wizardboss = Object.assign({}, wiz);

    wizardboss.scale = 0.7;
    wizardboss.hp = 220;
    wizardboss.dmg = 30;
    wizardboss.xp = 70;
    wizardboss.coordx = 136;
    wizardboss.coordy = 360;
    wizardboss.rect.ox = -2;
    wizardboss.rect.w = 17;
    wizardboss.boss = 'wizardboss'

    let houndboss = Object.assign({}, hound);

    houndboss.scale = 1;
    houndboss.coordx = 660;
    houndboss.hp = 220;
    houndboss.dmg = 30;
    houndboss.xp = 70;
    houndboss.coordy = 150;
    houndboss.rect.w = 30;
    houndboss.boss = 'houndboss'



    let assets = [char, skeletonboss, goblinboss, wizardboss, houndboss];
    assets.forEach( asset =>{
      this.setState({ allcoords: [ ...this.state.allcoords, { x: asset.coordx, y: asset.coordy } ] })
    })


    assetUnique.forEach(asset =>{
      let i = 0;
      let assetGroup = [];
      while( i < asset.quant){
        i ++;
        assetGroup.push(Object.assign({}, asset));
      }

      assetGroup.forEach(asset =>{
        let { x , y } = this.coordinateRange()
        asset.coordx = x;
        asset.coordy = y;
      })
      assets = [  ...assets, ...assetGroup, ];
    });

   
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
    game.stage.backgroundColor = '#000000';
    let map = game.add.tilemap('DungeonTilemap');
    map.addTilesetImage('DungeonTileset', 'DungeonTileset');
    map.addTilesetImage('WallTileset', 'WallTileset');
    
    // Enable Physics //
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 3;

    // Set Collision Groups // 
    let charCG = game.physics.p2.createCollisionGroup();
    let otherCG = game.physics.p2.createCollisionGroup();
    let wallsCG = game.physics.p2.createCollisionGroup();
    
    //Layer Generation with Asset Generator embedded
    let tiles;
    layers = layers.map( layer => {
      layer.variable = map.createLayer(layer.name);
      if(layer.name === 'foregrounddetails')
        assets = this.generateAsset(assets, game, charCG, otherCG, wallsCG);
      if(layer.collision){
        map.setCollisionBetween(1, 999, true, layer.name);
        tiles = game.physics.p2.convertTilemap(map, layer.name);
        tiles.forEach(tile=>{
          tile.setCollisionGroup(wallsCG);
          tile.collides(charCG);
          tile.collides(otherCG);
        }) 
      }
    });

    tiles.forEach(tile =>{
      let charBody = assets[0].variable.body;
      charBody.createBodyCallback(tile, this.noVelocity, this)
    });
    
    this.shadowTexture = this.game.add.bitmapData(this.game.width + 20, this.game.height + 20);
    this.lightSprite = this.game.add.image(0, 0, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

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
      if(cursors.up.isDown && cursors.right.isDown){
        body.moveUp(speed);
        char.animations.play('up');
      } else if(cursors.up.isDown && cursors.left.isDown){
        body.moveUp(speed);
        char.animations.play('up');
      } else if(cursors.down.isDown && cursors.left.isDown){
        body.moveDown(speed);
        char.animations.play('down');
      } else if(cursors.down.isDown && cursors.right.isDown){
        body.moveDown(speed);
        char.animations.play('down');
      } else if (cursors.left.isDown){
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
    this.updateShadowTexture();
    this.checkPos();
  }

  render(){
    let { goblinboss, wizardboss, houndboss, skeletonboss } = this.state
    if(!this.state.gamestart){
      return <div><MenuBar startGame={this.startGame}/> </div>
    }
    if(!goblinboss&&!wizardboss&&!houndboss&&!skeletonboss){
      return <div>
        <MenuBar startGame={this.startGame} win={true}/>
        <DialogBox movementAllow={this.movementAllow} movementDeny={this.movementDeny} encounter={this.state.encounter} dead={this.state.dead}/>
      </div>
    }
    if(this.state.health<=0){
      return <div>
        <MenuBar startGame={this.startGame} win={false}/>
      </div>
    }
    return(
        <div>
          <StatusBar props={this.state} lightSwitch={this.lightSwitch}/>
          <div id="phaser-container"/>
          <DialogBox movementAllow={this.movementAllow} movementDeny={this.movementDeny}encounter={this.state.encounter} dead={this.state.dead}/>
        </div>
    )
  }
}
  
ReactDOM.render(
  <div>
     <PhaserGame />
  </div>
  , document.querySelector('.container'));
