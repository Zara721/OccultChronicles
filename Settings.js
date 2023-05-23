class Settings {
    constructor() {
      this.element = document.createElement('div');
      this.element.id = 'settings';
      this.element.classList.add('Settings');
      this.element.style.display = 'none';
      document.body.appendChild(this.element);
    }
  
    render() {
      // create and configure the settings UI elements
      this.element.innerHTML = `
        <div class="music-settings">
          <span>Music</span>
          <button class="music-button on active">ON</button>
          <button class="music-button off">OFF</button>
        </div>
        <button class="how-to-play-button">How to Play</button>
      `;
  
      // add event listeners for music on and off buttons
      const onButton = this.element.querySelector('.music-button.on');
      const offButton = this.element.querySelector('.music-button.off');
      const howToPlayButton = this.element.querySelector('.how-to-play-button');
  
      onButton.addEventListener('click', (event) => {
        utils.emitEvent("musicOn");
        onButton.classList.add('active');
        offButton.classList.remove('active');
      });
  
      offButton.addEventListener('click', (event) => {
        utils.emitEvent("musicOff");
        offButton.classList.add('active');
        onButton.classList.remove('active');
      });
  
      howToPlayButton.addEventListener('click', (event) => {
        utils.emitEvent("rulesShow");
      });
    }
      
    show() {
      this.render();
      this.element.style.display = 'block';
    }
  
    hide() {
      this.element.style.display = 'none';
    }
  
    init() {
      // add a click event listener to the canvas
      const canvas = document.querySelector(".game-canvas");
      canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // check if the click is within the defined rectangle
        if (x >= 821 && x <= 990 && y >= 479 && y <= 513) {
          this.show();
        } else if (!this.element.contains(event.target)) {
          this.hide();
        }
      });
    }
  }
  