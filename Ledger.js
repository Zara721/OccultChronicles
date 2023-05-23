class Ledger {
    constructor() {
      this.element = document.createElement('div');
      this.element.id = 'ledger';
      this.element.classList.add('Ledger');
      this.element.style.display = 'none';
      document.body.appendChild(this.element);
  
      this.entries = [];
      this.currentWeek = 1;
    }
  
    addEntry(message, weekNumber) {
      //add a new entry to the ledger according to the week
      this.entries.push({ message, weekNumber });
      if (weekNumber > this.currentWeek) {
        this.currentWeek = weekNumber;
      }
      this.renderEntries();
    }
  
    renderEntries() {
      //clear the ledger
      this.element.innerHTML = '';
      
      //filter entries based on current week
      const weekEntries = this.entries.filter(entry => entry.weekNumber === this.currentWeek);
      
      //create and display all the entry elements
      weekEntries.forEach(({ message }) => {
        const entry = document.createElement('div');
        entry.textContent = message;
        this.element.appendChild(entry);
      });
      
      //show pagination buttons
      this.renderPagination();
    }
  
    renderPagination() {
      //calculate the total number of weeks
      const numWeeks = Math.max(...this.entries.map(entry => entry.weekNumber));
    
      //mage pagination element
      const pagination = document.createElement('div');
      pagination.classList.add('pagination');
      
      //craet and config next and previous buttons
      const prevButton = document.createElement('button');
      prevButton.innerHTML = '&larr;';
      prevButton.disabled = this.currentWeek === 1;
      prevButton.addEventListener('click', () => {
        this.currentWeek--;
        this.renderEntries();
      });
      pagination.appendChild(prevButton);
    
      const pageNumber = document.createElement('span');
      pageNumber.textContent = this.currentWeek;
      pagination.appendChild(pageNumber);
    
      const nextButton = document.createElement('button');
      nextButton.innerHTML = '&rarr;';
      nextButton.disabled = this.currentWeek === numWeeks;
      nextButton.addEventListener('click', () => {
        this.currentWeek++;
        this.renderEntries();
      });
      pagination.appendChild(nextButton);
    
      this.element.appendChild(pagination);
      }
  
    show() {
        this.element.style.display = 'block';
    }
  
    hide() {
        this.element.style.display = 'none';
    }
  
    init() {
        const canvas = document.querySelector(".game-canvas");
        // add a click event listener to the canvas
        canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        // check if the click is within the defined rectangle
        if (x >= 821 && x <= 988 && y >= 371 && y <= 405) {
            console.log("working")
            this.show();
        } else if (!this.element.contains(event.target)) {
            this.hide();
        }
        });
  
      // add a  event listener to the document to check for clicking of l key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'l' || event.key === 'L') {
            event.preventDefault();
          if (this.element.style.display === 'none') {
            this.show();
          } else {
            this.hide();
          }
        }
      });
    }
}
  
