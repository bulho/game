//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: 560,
  height: 560,
  antialias: true,
  transparent: false,
  resolution: 1
}
);
app.renderer.backgroundColor = 0xe0e0e0;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
loader
  .add("img/block.jpg")
  .load(setup);

let block, state;

//This `setup` function will run when the image has loaded
function setup() {

  //Create the block sprite
  block = new Sprite(loader.resources["img/block.jpg"].texture);
  block.vx = 0;
  block.vy = 0;

  //assigns keyboard motion handler
  new KeyboardHandler(block, 2);

  //Set the game state
  state = play;

  //Add the block to the stage
  app.stage.addChild(block);
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

function play(delta) {
  //Move
  block.x += block.vx;
  block.y += block.vy;

  contain(block, {x: 0, y: 0, width: 488, height: 480});
}

