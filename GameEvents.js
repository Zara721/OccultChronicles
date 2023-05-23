class GameEvent {
    constructor({event}) {
        this.event = event;
    }

    speech(resolve) {
        const speech =  new SpeechBox({
          text: this.event.text,
          character: this.event.character,
          onComplete: () => resolve()
        })
        speech.init(document.querySelector(".game-container"))
      }
    
    choice(resolve) {
      const choice =  new PlayerChoice({
        choice1: this.event.choice1,
        choice2: this.event.choice2,
        consequence1: this.event.consequence1,
        consequence2: this.event.consequence2,
        response1: this.event.response1,
        response2: this.event.response2,
        nextNode1: this.event.nextNode1,
        nextNode2: this.event.nextNode2,
        character: this.event.character,
  
        onComplete: () => resolve()
      })
      choice.init(document.querySelector(".game-container"))
    } 

    changeNode(resolve) {
      const newNode = this.event.newNode;
      const character = this.event.character;
      window.gameState.updateDialogueNode(character, newNode);
      resolve();
    }

    consequence(resolve) {
      const [resource, amount] = this.event.consequence;
      window.gameState.changeResource(resource, amount);
      resolve();
    }

    alliesUpdate(resolve) {
      const society = this.event.society;
      const relationship = this.event.relationship;
      window.gameState.updateRelations(society, relationship);
      resolve();
    }

    addItem(resolve) {
      const itemId = this.event.itemId;
      window.gameState.addItem(itemId);
      resolve();
    }

    removeItem(resolve) {
      const itemId = this.event.itemId;
      window.gameState.removeItem(itemId);
      resolve();

    }

    addEnding(resolve) {
      const ending = this.event.ending;
      window.gameState.pushEnding(ending);
      resolve();
    }

    init() {
      return new Promise(resolve => {
        this[this.event.type](resolve)
      })
    }
}