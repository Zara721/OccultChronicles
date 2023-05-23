class SpeechBox {
    constructor({character, text, onComplete}) {
        this.character = character;
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        // create the element
        this.element = document.createElement('div');
        this.element.classList.add("SpeechBox");
        
        // set the background image
        this.element.style.backgroundImage = `url("images/speechBox.png")`;

        // add character name and text
        this.element.innerHTML = `
            <h3 class="SpeechBox_character">${this.character}</h3>
            <p class="SpeechBox_text"></p>
        `;

        // use RevealingText for the typewriter effect
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".SpeechBox_text"),
            text: this.text
        });

        // add event listener for clicking on the element
        this.element.addEventListener("click", () => {
            this.done();
        });
    }

    done() {
        if (this.revealingText.isDone) {
            this.element.remove();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}
