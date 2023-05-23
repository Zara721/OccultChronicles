class Game {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.bgMusic = new Sound("./sound/castleMusic.mp3");
        this.musicPlaying = true;
    }

    startGameLoop() {
  
        const targetFPS = 60;
        const targetFrameTime = 1000 / targetFPS; // Time per frame in milliseconds
        let lastFrameTime = Date.now();
        
        const loop = () => {
            const now = Date.now();
            const elapsedTime = now - lastFrameTime;
        
            if (elapsedTime >= targetFrameTime) {

            // Draw game objects
            this.render();
        
            lastFrameTime = now;
            }
        
            setTimeout(loop, Math.max(targetFrameTime - elapsedTime, 0));
        };
        
        loop();
    }
      
    render() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game objects here
        //Draw in the background image
        this.map.drawBackgroundImage(this.ctx)

        //Draw in the characters
        Object.values(this.map.backgroundObjects).forEach(object => {
            object.sprite.draw(this.ctx)
        })

        Object.values(this.map.characters).forEach(character => {
            character.update();
            character.sprite.draw(this.ctx)
        })

        //Draw in the hud elements (like nameTags) image
        this.map.drawHUDelements(this.ctx)

    }

    musicOn() {
        //listens for event from the Settings class that allows the user totoggle music on or off
        document.addEventListener("musicOn", e => {
            if(!this.musicPlaying) {
                this.bgMusic.loop();
                this.musicPlaying = true;
            }
        })
      }
  
      musicOff() {
        document.addEventListener("musicOff", e => {
            if(this.musicPlaying) {
                this.bgMusic.stop();
                this.musicPlaying = false;
            }
        })
    }

    async init() {
        const container = document.querySelector(".game-container");

        // Create and initialize the TitleScreen
        this.titleScreen = new TitleScreen();
        await this.titleScreen.init(container);

        // Remove the TitleScreen
        this.titleScreen.close();

        // window.gameState.endingManager.init(document.querySelector('.game-container'));

        this.map = new GameMap(window.GameMaps.GameScreen);
        this.map.spawnCharacters();
        this.canvas.addEventListener('mousemove', (e) => this.map.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.map.handleMouseMove(e));


        this.resourcesState = new Resources
        this.resourcesState.init(container)

        this.timeKeeper = new TimeKeeper
        this.timeKeeper.init(container)

        // window.gameState.nextWeek();

        // this.resourcesState.changeResource('wealth', 10);

        // window.gameState.addItem("plant");
        // window.gameState.addItem("plant");
        // window.gameState.addItem("plant");
        // window.gameState.addItem("plant");
        // window.gameState.addItem("plant");
        // window.gameState.addItem("plant");

        //play background music
        this.bgMusic.loop();

        //Add music togglers
        this.musicOn();
        this.musicOff();

        //Kick off the game
        this.startGameLoop();
        


        // this.map.startCutscene([
        //     {type: "speech", character: "Emery", text: "Your Grace, a merchant from Tenebris sabotaging our crystal industry",},
        //     {type: "addItem", itemId: "amulet"},
        //     {type: "addItem", itemId: "scale"},
        //     {type: "addItem", itemId: "vial"},
        //     {type: "addEnding", ending: "betrayal"},
        //     {type: "changeNode", character: "Emery", newNode: null},
        //     {type: "speech", character: "Emery", text: "Plant...",},
        //     {type: "alliesUpdate", society: "Pracepta", relationship: "happy"},
        //     {type: "removeItem", itemId: "plant"},
        //     {type: "speech", character: "Emery", text: "Please can you help support the search for Aunt Eudora",},
        //     {type: "choice", choice1: "Send Troops", choice2: "Decline",
        //         consequence1: [['golems', -5],  ['supplies', -100], ['wealth', -5]], consequence2: null ,
        //         character: "Emery", response1: "Thank you for your troubles", response2: "I shall remeber this",
        //         nextNode1: "reveal", nextNode2: "request"},
        // ])
    }
}

