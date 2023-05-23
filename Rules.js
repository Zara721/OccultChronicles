class Rules {
    constructor() {
      this.element = document.createElement("div");
      this.element.id = "rules";
      this.element.innerHTML = `
        <span class="close">X</span>
        <h2>How to Play</h2>
        <h2>Making Choices</h2>
        <p>When making choices, some decisions will have costs associated with them, 
        which will be shown in brackets such as (5G), C stands for crystals which is 
        the wealth of your Domain, G stands for golems which are your troops, 
        S stands for supplies, and I stands for influence. A warning will pop up when you don’t 
        have enough resources for a choice.</p>
        <h2>Buttons</h2>
        <p>Clicking on the Allies button will allow you to check your Domains relationship with 
        other societies. The Ledger button will show the expenses and income for each week. 
        The Settings buttons allow you to toggle music on and off and refer back to the How to Play rules.</p>
        <h2>Character Interaction</h2>
        <p>You can call a character to the throne by clicking on that character. 
        Then you can click on the speech box to see the following character dialogue and click 
        on choices on the side to make decisions. A character will automatically leave the throne room 
        when they have nothing more to say.</p>
        <p>(Click the X in the top right corner to close)</p>
      `;
      this.element.style.display = "none";
      document.body.appendChild(this.element);
  
      // Add event listener for the close button
        this.element.querySelector(".close").addEventListener("click", () => {
            this.hide();
        });
    }
  
    show() {
      this.element.style.display = "block";
      console.log("rules")
    }
  
    hide() {
      this.element.style.display = "none";
      console.log("rules gone")
    }
  }
  