const utils = {  
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, ms)
      })
    },

    randomFromArray(array) {
      return array[ Math.floor(Math.random()*array.length) ]
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    
    getRandomKeys(obj, count, startIndex = 0) {
      const keys = Object.keys(obj);
      const result = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = utils.getRandomInt(startIndex, keys.length - 1);
        result.push(keys[randomIndex]);
        keys.splice(randomIndex, 1);
      }
      return result;
    },
    
    
    emitEvent(name, detail) {
      const event = new CustomEvent(name, {
            detail
      });
      document.dispatchEvent(event);
    },

    moveCharacterToPosition(character, targetX) {
      return new Promise((resolve) => {
          // Calculate the distance to move
          const distanceX = targetX - character.x;
  
          // Set the character's direction and moving progress
          character.movingProgressRemaining = Math.abs(distanceX);
  
          // Resolve the promise when the character reaches the target position
          const checkPositionInterval = setInterval(() => {
              if (character.x === targetX ) {
                  clearInterval(checkPositionInterval);
                  resolve();
              }
          }, 50);
      });
   },

   moveCharacterToPositionSpeed(character, targetX, speed) {
    return new Promise((resolve) => {
        // Calculate the distance to move
        const distanceX = targetX - character.x;

        // Set the character's direction and moving progress
        character.movingProgressRemaining = Math.abs(distanceX);

        // Calculate the movement direction (-1 for left, 1 for right)
        const direction = distanceX > 0 ? 1 : -1;

        // Calculate the time of the last update
        let lastUpdateTime = Date.now();

        // Resolve the promise when the character reaches the target position
        const checkPositionInterval = setInterval(() => {
            // Calculate the elapsed time since the last update
            const elapsedTime = Date.now() - lastUpdateTime;

            // Update the character's position based on the speed and elapsed time
            character.x += direction * speed * elapsedTime;

            // Check if the character has reached the target position
            if ((direction === 1 && character.x >= targetX) || (direction === -1 && character.x <= targetX)) {
                // Clamp the character's position to the target position
                character.x = targetX;

                clearInterval(checkPositionInterval);
                resolve();
            }

            // Update the last update time
            lastUpdateTime = Date.now();
        }, 50);
    });
  },

  filterCharactersByWeekAndDialogueNodes(week, configCharacters) {
    const gameStateNames = Object.keys(window.gameState.dialogueNodes);
  
    if (week == 5) {
      const filteredEntries = Object.entries(configCharacters)
        .filter(([key, character]) => {
          return (
            gameStateNames.includes(character.name) &&
            window.gameState.dialogueNodes[character.name] !== null
          );
        });
        
      console.log(filteredEntries);
      return Object.fromEntries(filteredEntries);
    } else {
      return configCharacters;
    }
  },

  allCharacterNodesAreNull() {
    return Object.values(window.gameState.dialogueNodes).every(node => node === null);
  } 
  
}