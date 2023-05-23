class TitleScreen {
    constructor() {}
  
    getOptions() {
        return new Promise((resolve) => {
          const startButton = this.element.querySelector(".StartButton");
          startButton.addEventListener("click", () => {
            utils.emitEvent("NewGame");
            this.close();
            resolve();
          });
        });
    }
  
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = `
          <h1 class="title-text">Occult Chronicles</h1>
          <button class="StartButton">Start</button>
        `;
      }
      
  
    close() {
        this.element.remove();
    }
  
    async init(container) {
        this.createElement();
        container.appendChild(this.element);
        setTimeout(() => {
            this.element.classList.add("show"); // Add the "show" class after appending
          }, 100);
        await this.getOptions();
    }
  }
  
  