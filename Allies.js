class Allies {
    constructor() {
      this.element = document.createElement('div');
      this.element.id = 'allies';
      this.element.classList.add('Allies');
      this.element.style.display = 'none';
      document.body.appendChild(this.element);
    }
  
    // show the realtionship information for each society
    render() {
        this.element.innerHTML = '';

        // Loop through all societies in the gameState
        for (const [society, relationship] of Object.entries(window.gameState.allies)) {
          const entry = document.createElement('div');
          entry.classList.add('society-entry', society.toLowerCase());
          entry.innerHTML = `
            <div class="society-name" style="color: ${this.getSocietyColor(society)};">${society}: ${relationship}</div>
            <div class="society-leader">Leader: ${this.getLeaderName(society)}</div>
          `;
          this.element.appendChild(entry);
        }
      }
    
    // returns the leader's name for a given society
    getLeaderName(society) {
        switch (society) {
          case 'Pracepta':
            return 'Lady Hawthorne';
          case 'Hermeticus':
            return 'Sir Magnus';
          case 'Tenebris':
            return 'Madame Diane';
          default:
            return '';
        }
    }

    // returns the color for a given society
    getSocietyColor(society) {
        switch (society) {
          case 'Pracepta':
            return '#F19EC1';
          case 'Hermeticus':
            return '#98def5';
          case 'Tenebris':
            return '#90eeac';
          default:
            return '';
        }
    }
    
    show() {
        this.render();
        this.element.style.display = 'block';
    }
  
    hide() {
        this.element.style.display = 'none';
    }
    
    // initializes event listeners for showing and hiding the allies element
    init() {
        const canvas = document.querySelector(".game-canvas");
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
  
            if (x >= 821 && x <= 990 && y >= 425 && y <= 460) {
            this.show();
            } else if (!this.element.contains(event.target)) {
            this.hide();
            }
        });
    }
  }
  