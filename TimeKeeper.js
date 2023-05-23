class TimeKeeper {
    constructor() {
      this.weekElement = null;
    }
  
    update() {
      if (this.weekElement) {
        this.weekElement.textContent = `Week: ${window.gameState.week}`;
      }
    }
  
    createWeekElement() {
      const element = document.createElement('div');
      element.id = 'week';
      element.textContent = `Week: ${window.gameState.week}`;
      return element;
    }
  
    init(container) {
      this.weekElement = this.createWeekElement();
      container.appendChild(this.weekElement);
  
      document.addEventListener('nextWeek', () => {
        this.update();
      });
    }
  }
  