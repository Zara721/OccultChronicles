class Character {
    constructor(config) {
        this.name = config.name;
        this.x = config.x || 0;
        this.y = config.y || 372;
        this.direction = config.direction || "right";

        this.sprite = new Sprite ({
            character: this,
            src: config.src || "/images/characters/Emery.png",
            spriteHeight: config.spriteHeight || 96
          });

        this.movingProgressRemaining = 0;
        this.directionUpdate = {
            "right": ["x", 1],
            "left": ["x", -1],
          };

        this.dialogueNodes = config.dialogue || [];
        this.dialogueNodesIndex = 0;
    }

    update() {
        this.updatePosition();
        this.updateSprite();
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1
        }
    }

    updateSprite() {
        this.sprite.setAnimation("idle-" + this.direction);
    }

    async doDialogueNode(map) {
        // Get the character's name and its dialogue node from window.GameState
        const characterName = this.name;
        const dialogueNode = window.gameState.dialogueNodes[characterName];
    
        // If there is no dialogue node for this character, return
        if (!dialogueNode) {
            return;
        }
        
        map.isCutscenePlaying = true;
        
        // Get the event config from this.dialogueNodes using dialogueNode as the key
        const eventConfig = this.dialogueNodes[dialogueNode];

        // Loop through all the events in the eventConfig array and await each event
        for (let i = 0; i < eventConfig.length; i++) {
            const eventHandler = new GameEvent({ event: eventConfig[i], map: this.map });
            await eventHandler.init();
        }

        // Increment the dialogueNodesIndex
        this.dialogueNodesIndex += 1;
        if (this.dialogueNodesIndex === this.dialogueNodes.length) {
            this.dialogueNodesIndex = 0;
        }

        // Update the dialogue node in window.GameState for this character
        // window.gameState.dialogueNodes[characterName] = this.dialogueNodes[this.dialogueNodesIndex];

        // Set isCutscenePlaying to false
        map.isCutscenePlaying = false;
        map.exitThrone();
    }
    
}