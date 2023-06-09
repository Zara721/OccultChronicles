class GameState {
    constructor() {
        //determine the time (weeks into the game)
        this.week = 1;
        // Initialize the resources with starting values
        this.resources = {
            wealth: 50,
            supplies: 30,
            golems: 20,
            influence: 10,
        };
        //items stored on the player
        this.inventory = [];
        this.dialogueNodes = {
            "Emery": "node1",
            "Maxine": "node1",
            "Gaius": "node1",
            "Lucien": "node1",
            "Flora": "node1",
            "Vincent": "node1",
            "Elspeth": "node1",
            "Rowan": "node1",
            "Diane": "node1",
            "Magnus": "node1",
            "Hawthorne": "node1",
            "Alchemist": "node1",
            "Blacksmith": "node1",
            "Healer": "node1",
            "Merchant": "node1",
        }

        this.allies = {
           Pracepta: "neutral",
           Hermeticus: "neutral",
           Tenebris: "neutral",
        }

        this.endings = [
          // "betrayal",
          // "lucienInvestigate",
          // "military",
          // "hemlock",
          // "littleWitch",
          // "dianeAlly",
        ]

        this.alliesDisplay = new Allies();
        this.alliesDisplay.init();

        this.ledger = new Ledger();
        this.ledger.init();

        this.settings = new Settings();
        this.settings.init();

        this.inventoryDisplay = new Inventory();
        this.inventoryDisplay.init();

        // tell the player the rules
        this.rules = new Rules();
        this.rulesShow = document.addEventListener("rulesShow", e => {
          this.rules.show();
        })

        this.endingManager = new EndingManager({
          endings: this.endings,
          onComplete: () => {
            console.log('Ending completed');
            // Add any actions for after the ending sequence is completed
          },
        });
        
    }

    //advances the game to the next week
    nextWeek() {
      this.week++;
      utils.emitEvent("nextWeek");
    }

    // changes the specified resource by the given amount and emits a "resourceStateChange" event
    changeResource(resource, amount) {
      if (this.resources[resource] + amount >= 0) {
        const sign = amount >= 0 ? 'income' : 'expense';
        const message = `Week ${this.week} an ${sign} of ${Math.abs(amount)} ${resource}`;
        this.ledger.addEntry(message, this.week);
        this.resources[resource] += amount;
        utils.emitEvent("resourceStateChange");
        return true;
      } else {
        this.displayWarning();
        return false;
      }
    }

    // updates the associated dialogue node for the specified character
    updateDialogueNode(character, newNode) {
      this.dialogueNodes[character] = newNode;
    }

    // updates the relationship status for the specified society 
    updateRelations(society, relationshipStatus) {
      if (this.allies.hasOwnProperty(society)) {
        this.allies[society] = relationshipStatus;
        utils.emitEvent("relationsUpdated");
      }
    }

    //adds item to inventory
    addItem(itemId) {
      this.inventory.push(itemId);
      utils.emitEvent("InventoryStateChange");
    }
  
    //removes item from inventory
    removeItem(itemId) {
      const itemIndex = this.inventory.indexOf(itemId);
  
      if (itemIndex !== -1) {
        this.inventory.splice(itemIndex, 1);
        utils.emitEvent("InventoryStateChange");
      }
    }

    //adds ending to the ending array to be shown at end of the game
    pushEnding(ending) {
      this.endings.push(ending);
    }

    //shows a warning for when the player doesn't have enough resources for an option
    displayWarning() {
      const warning = document.createElement('div');
      warning.classList.add('ResourceWarning');
      warning.textContent = 'Not enough Resources';
      document.body.appendChild(warning);
      
      setTimeout(() => {
          warning.remove();
      }, 3000);
    }
  
      
}
window.gameState = new GameState();

