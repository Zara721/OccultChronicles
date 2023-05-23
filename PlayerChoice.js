class PlayerChoice {
    constructor(config) {
      this.choice1 = config.choice1;
      this.choice2 = config.choice2;
  
      this.consequence1 = config.consequence1;
      this.consequence2 = config.consequence2;

      this.response1 = config.response1;
      this.response2 = config.response2;

      this.nextNode1 = config.nextNode1;
      this.nextNode2 = config.nextNode2;

      this.character = config.character;
  
      this.onComplete = config.onComplete;
      this.element = null;
    }
  
    createElement() {
      this.element = document.createElement('div');
      this.element.classList.add('PlayerChoice');
  
      this.element.innerHTML = `
        <button class="PlayerChoice_button PlayerChoice_button--1">${this.choice1}</button>
        <button class="PlayerChoice_button PlayerChoice_button--2">${this.choice2}</button>
      `;
  
      this.element.querySelector('.PlayerChoice_button--1').addEventListener('click', () => {
        if (this.consequence1) {
          const success = this.applyConsequences(this.consequence1);
          console.log(window.gameState.resources);
      
          if (success) {
            this.handleResponse(1);
          }
        } else {
          this.handleResponse(1);
        }
      });
      
      this.element.querySelector('.PlayerChoice_button--2').addEventListener('click', () => {
        if (this.consequence2) {
          const success = this.applyConsequences(this.consequence2);
          if (success) {
            this.handleResponse(2);
          }
        } else {
          this.handleResponse(2);
        }
      });
      
    }

    hasEnoughResources(consequences) {
      let canAfford = true;
      if (!Array.isArray(consequences[0])) {
        // Handle single consequence by checking if it's a nested array
        const [resource, amount] = consequences;
        canAfford = window.gameState.resources[resource] + amount >= 0;
      } else {
        // Handle multiple consequences
        for (const [resource, amount] of consequences) {
          if (window.gameState.resources[resource] + amount < 0) {
            canAfford = false;
            break;
          }
        }
      }
      return canAfford;
    }
    

    applyConsequences(consequences) {
      // First, check if the player has enough resources for all consequences
      if (!this.hasEnoughResources(consequences)) {
        // If not, display a warning and return false
        window.gameState.displayWarning();
        return false;
      }
    
      let success = true;
      if (!Array.isArray(consequences[0])) {
        // Handle single consequence by checking if it's a nested array
        const [resource, amount] = consequences;
        success = window.gameState.changeResource(resource, amount);
      } else {
        // Handle multiple consequences
        consequences.forEach(([resource, amount]) => {
          success = success && window.gameState.changeResource(resource, amount);
        });
      }
      return success;
    }

    handleResponse(choiceNumber) {
      // Remove the buttons before displaying the response.
      this.element.querySelectorAll('.PlayerChoice_button').forEach(button => button.remove())

      const response = choiceNumber === 1 ? this.response1 : this.response2;
      const nextNode = choiceNumber === 1 ? this.nextNode1 : this.nextNode2;
    
      // Display the response as a speech.
      const speech = new SpeechBox({
        character: this.character,
        text: response,
        onComplete: () => {
          // Update the dialogueNodes.
          window.gameState.updateDialogueNode(this.character, nextNode);
          this.done();
        },
      });
      speech.init(document.querySelector('.game-container'));
    }
    
  
    done() {
      this.element.remove();
      this.onComplete();
    }
  
    init(container) {
      this.createElement();
      container.appendChild(this.element);
    }
  }
  