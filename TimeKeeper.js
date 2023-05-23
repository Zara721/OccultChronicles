class TimeKeeper {
    constructor() {
      this.weekElement = null;
    }
    
    //updates the week display on the game canvas menu
    update() {
      if (this.weekElement) {
        this.weekElement.textContent = `Week: ${window.gameState.week}`;
      }
    }
    
    //makes the week display element
    createWeekElement() {
      const element = document.createElement('div');
      element.id = 'week';
      element.textContent = `Week: ${window.gameState.week}`;
      return element;
    }
  
    //initializes the week display element and listens for the 'nextWeek' event so as to update the display
    init(container) {
      this.weekElement = this.createWeekElement();
      container.appendChild(this.weekElement);
  
      document.addEventListener('nextWeek', () => {
        this.update();
      });
    }
  }
  