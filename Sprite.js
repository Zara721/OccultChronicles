class Sprite {
    constructor(config) {
      //Set up the image
      this.image = new Image ();
      this.image.src = config.src
      this.image.onload = () => {
        this.Loaded = true;
      }

      this.spriteWidth = config.spriteWidth || 48;
      this.spriteHeight = config.spriteHeight || 96;

      //config animation and inital state
      this.animations = config.animations || {
        "idle":  [ [0,0] ],
        "idle-right":  [ [0,0], [1,0], [2,0], [3,0] ],
        "idle-left": [ [4,0], [5,0], [6,0], [7,0] ],
      }

      this.currentAnimation = config.currentAnimation || "idle-right";
      this.currentAnimationFrame = 0;
      
      this.randomOffset = Math.floor(Math.random() * 5) - 2; // Generates a random number between -2 and 2
      this.animationFrameLimit = (config.animationFrameLimit || 15) + this.randomOffset;
      this.animationFrameProgress = this.animationFrameLimit;

      //Reference the character
      this.character = config.character;
    }

    get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
      if(this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }

    updateAnimationProgress() {
      //Countdown frame progress
      if(this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return;
      }
      
      //Resetting the counter
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame +=1;
      
      if(this.frame == undefined) {
        this.currentAnimationFrame = 0;
      }
      
    }

    draw(ctx) {
        const x = this.character.x;
        const y = this.character.y;

        const [frameX, frameY] = this.frame;
        
      //wait utli image is loaded to draw the sprite to the canvas, based on the sprites dimensions
        if (this.Loaded) {
            ctx.drawImage (this.image, 
              frameX * this.spriteWidth, frameY * this.spriteHeight, //x,y starting position
              this.spriteWidth, this.spriteHeight, // width, height of the frame in the sprite sheet
              x, y, //x,y position to draw at
              this.spriteWidth, this.spriteHeight // width, height of the frame in the canvas    
            )
        }

        this.updateAnimationProgress();
      }
}