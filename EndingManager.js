class EndingManager {
    constructor(config) {
        this.endings = config.endings;
        this.currentEndingIndex = 0;
        this.onComplete = config.onComplete;
        this.element = null;
    }
  
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('EndingManager');
    
        this.element.innerHTML = `
            <div class="EndingManager_image"></div>
            <div class="EndingManager_text"></div>
        `;
  
        this.element.addEventListener('click', () => {
            this.showNextEnding();
        });
    }

    clearImage() {
        const imageElement = this.element.querySelector('.EndingManager_image');
        while (imageElement.firstChild) {
            imageElement.removeChild(imageElement.firstChild);
        }
    }
      
    showEnding(endingText, endingSrc) {
        const textElement = this.element.querySelector('.EndingManager_text');
        const imageElement = this.element.querySelector('.EndingManager_image');
        textElement.innerHTML = ''; // Clear the previous text
        this.clearImage();
      
        if (endingSrc) {
            const img = document.createElement('img');
            img.src = endingSrc;
            img.id = 'endingImage';
            imageElement.appendChild(img);
        }
      
        this.revealingText = new RevealingText({
            element: textElement,
            text: endingText,
            speed: 60,
        });
      
        this.revealingText.init();
    }
      
    
    showNextEnding() {
        if (this.revealingText && !this.revealingText.isDone) {
            this.revealingText.warpToDone();
            return;
        }

        if (this.currentEndingIndex < this.endings.length) {
            const endingName = this.endings[this.currentEndingIndex];
            const endingText = window.endings[endingName].text;
            const endingSrc = window.endings[endingName].src; 
            this.showEnding(endingText, endingSrc); 
            this.currentEndingIndex++;
          } else {
                this.showThanksForPlaying();
            }
    }

    showThanksForPlaying() {
        const textElement = this.element.querySelector('.EndingManager_text');
        textElement.innerHTML = 'Thanks For Playing!';
        textElement.classList.add('thanksForPlaying'); 
        this.clearImage();
    }
  
    init(container) {
      this.createElement();
      container.appendChild(this.element);
      this.showNextEnding();
    }
  }
  
