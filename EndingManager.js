class EndingManager {
    constructor(config) {
        this.endings = config.endings;
        this.currentEndingIndex = 0;
        this.onComplete = config.onComplete;
        this.element = null;
    }
    
    //makes the elements needed to show the endings
    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('EndingManager');
    
        this.element.innerHTML = `
            <div class="EndingManager_image"></div>
            <div class="EndingManager_text"></div>
        `;
        
        //on click show the next ending
        this.element.addEventListener('click', () => {
            this.showNextEnding();
        });
    }

    //removes any images still on the screen
    clearImage() {
        const imageElement = this.element.querySelector('.EndingManager_image');
        while (imageElement.firstChild) {
            imageElement.removeChild(imageElement.firstChild);
        }
    }
    
    //shows specific ending with associated text or image
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

    //shows the final thanks for playing screen
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
  
