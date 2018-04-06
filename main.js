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
}
);
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
loader
  .add("img/treasureHunter.json")
  .load(setup);

let state;

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
  new MakeBlobs(Sprite,gameScene);

  //Attaches keyboard handler
  new KeyboardHandler(explorer,2);

  //Set the game state
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

function play(delta) {
  //Move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;
  contain(explorer, {x: 28, y: 10, width: 488, height: 480});
}

