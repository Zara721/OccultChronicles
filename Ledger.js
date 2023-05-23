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
      this.entries.push({ message, weekNumber });
      if (weekNumber > this.currentWeek) {
        this.currentWeek = weekNumber;
      }
      this.renderEntries();
    }
  
    renderEntries() {
      this.element.innerHTML = '';
  
      const weekEntries = this.entries.filter(entry => entry.weekNumber === this.currentWeek);
  
      weekEntries.forEach(({ message }) => {
        const entry = document.createElement('div');
        entry.textContent = message;
        this.element.appendChild(entry);
      });
  
      this.renderPagination();
    }
  
    renderPagination() {
        const numWeeks = Math.max(...this.entries.map(entry => entry.weekNumber));
      
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');
      
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
        // Add a click event listener to the canvas
        canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        // Check if the click is within the defined rectangle
        if (x >= 821 && x <= 988 && y >= 371 && y <= 405) {
            console.log("working")
            this.show();
        } else if (!this.element.contains(event.target)) {
            this.hide();
        }
        });
  
      // Add a  event listener to the document
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
  
