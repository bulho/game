function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }


class KeyboardHandler {

    constructor(s, v) {
        this.sprite = s;
        this.velocity = v;

        //Capture the keyboard arrow keys
        this.left = keyboard(37);
        this.up = keyboard(38);
        this.right = keyboard(39);
        this.down = keyboard(40);

        //Keyboard handler
        this.left.press = () => {
            this.sprite.vx = -this.velocity;
            this.sprite.vy = 0;
        }
        this.left.release = () => {
            this.sprite.vx = 0;
            if (this.right.isDown) {
                this.sprite.vx = this.velocity;
                this.sprite.vy = 0;
            };
        }
        this.right.press = () => {
            this.sprite.vx = this.velocity;
            this.sprite.vy = 0;
        }
        this.right.release = () => {
            this.sprite.vx = 0;
            if (this.left.isDown) {
                this.sprite.vx = -this.velocity;
                this.sprite.vy = 0;
            };
        }
        this.up.press = () => {
            this.sprite.vy = -this.velocity;
            this.sprite.vx = 0;
        }
        this.up.release = () => {
            this.sprite.vy = 0;
            if (this.down.isDown) {
                this.sprite.vx = 0;
                this.sprite.vy = this.velocity;
            };
        }
        this.down.press = () => {
            this.sprite.vy = this.velocity;
            this.sprite.vx = 0;
        }
        this.down.release = () => {
            this.sprite.vy = 0;
            if (this.up.isDown) {
                this.sprite.vx = 0;
                this.sprite.vy = -this.velocity;
            };
        }

    }



}