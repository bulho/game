//Aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Graphics = PIXI.Graphics,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

//Create a Pixi Application
let app = new Application({
  width: 512,
  height: 512,
  antialiasing: true,
  transparent: false,
  resolution: 1
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
loader
  .add("img/treasureHunter.json")
  .load(setup);

let state, blobs;
let explorerHit = false;

//This `setup` function will run when the image has loaded
function setup() {

  gameScene = new Container();
  app.stage.addChild(gameScene);

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  //Create an alias for the texture atlas frame ids
  id = resources["img/treasureHunter.json"].textures;

  //Dungeon
  dungeon = new Sprite(id["dungeon.png"]);
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(id["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  //Explorer
  explorer = new Sprite(id["explorer.png"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  //Make Blobs
  let makeBlobs = new MakeBlobs(Sprite, gameScene);
  blobs = makeBlobs.getBlobs();

  //Make the health bar
  //Create the health bar
  healthBar = new PIXI.DisplayObjectContainer();
  healthBar.position.set(app.stage.width - 170, 4)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  //Make the gameover message
  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  message = new Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  //Attaches keyboard handler
  new KeyboardHandler(explorer, 2);

  //Set the game state
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

let randomDirectionX = [1,1,1,1,1,1],
    randomDirectionY = [1,1,1,1,1,1];

setInterval(function(){
  randomDirectionX.forEach((i,idx)=>{
    randomDirectionX[idx] = randomInt(-1,1);
    randomDirectionY[idx] = randomInt(-1,1);
  });
},500);

function play(delta) {
  //Move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;
  contain(explorer, { x: 28, y: 10, width: 488, height: 480 });

  //Move Blobs
  blobs.forEach(function (blob,idx) {

    //Move the blob
    blob.y += blob.vy;// * randomDirectionY[idx];
    blob.x += blob.vx * randomDirectionX[idx];

    //Check the blob's screen boundaries
    let blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

    //If the blob hits the top or bottom of the stage, reverse
    //its direction
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }

    //If the blob hits the left or right of the stage, reverse
    //its direction
    if (blobHitsWall === "left" || blobHitsWall === "right") {
      blob.vx *= -1;
    }

    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    } else {
      explorerHit = false;
    }

    if (explorerHit) {
      //Make the explorer semi-transparent
      explorer.alpha = 0.5;

      //Reduce the width of the health bar's inner rectangle by 1 pixel
      healthBar.outer.width -= 1;

      if (healthBar.outer.width < 0) {
        state = end;
        message.text = "You lost!";
      }
    } else {
      //Make the explorer fully opaque (non-transparent) if it hasn't been hit
      explorer.alpha = 1;
    }

  });

  //Test for successful explorer taking treasure to door
  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = "You won!";
  }

  //Test for explorer taking treasure
  if (hitTestRectangle(explorer, treasure)) {
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

