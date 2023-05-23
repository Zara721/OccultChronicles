const utils = {  
    //waits for a specified time (in miliseconds) before resolving the promise make a time stop gap
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, ms)
      })
    },

    //returns a random element from an array
    randomFromArray(array) {
      return array[ Math.floor(Math.random()*array.length) ]
    },

    //returns a random interger from a range on min-max numbers
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    
    // returns an array of unique random keys from an object, based on the specified count and start index
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
    
    //emits a custom event with specified name and detal
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
        // calculate the distance to move
        const distanceX = targetX - character.x;

        // set the character's direction and moving progress
        character.movingProgressRemaining = Math.abs(distanceX);

        // calculate the movement direction (-1 for left, 1 for right)
        const direction = distanceX > 0 ? 1 : -1;

        // calculate the time of the last update
        let lastUpdateTime = Date.now();

        // resolve the promise when the character reaches the target position
        const checkPositionInterval = setInterval(() => {
            // calculate the elapsed time since the last update
            const elapsedTime = Date.now() - lastUpdateTime;

            // update the character's position based on the speed and elapsed time
            character.x += direction * speed * elapsedTime;

            // check if the character has reached the target position
            if ((direction === 1 && character.x >= targetX) || (direction === -1 && character.x <= targetX)) {
                // change the character's position to the target position
                character.x = targetX;

                clearInterval(checkPositionInterval);
                resolve();
            }

            // update the last update time
            lastUpdateTime = Date.now();
        }, 50);
    });
  },

  // filters characters based on the week and dialogue nodes
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

  // checks if all character dialogue nodes are null
  allCharacterNodesAreNull() {
    return Object.values(window.gameState.dialogueNodes).every(node => node === null);
  } 
  
}