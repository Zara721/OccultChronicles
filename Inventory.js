class Inventory {
    constructor() {
      this.element = document.createElement('div');
      this.element.id = 'inventory';
      this.element.classList.add('Inventory');
      document.body.appendChild(this.element);
    }

    display() {
      //clear the inventory
      this.element.innerHTML = '';
      
      //calculate the position of inventory on the game canvas
      const offsetX = 940;
      const offsetY = 245;
      
      // Iterate through the inventory items and display them based on their index in the gameState inventory
      window.gameState.inventory.forEach((itemId, index) => {
        const item = window.Items[itemId];
        const itemElement = document.createElement('img');
        itemElement.src = item.src;
        itemElement.style.width = '60px';
        itemElement.style.height = '60px';
        itemElement.style.position = 'absolute';
        const columnIndex = index % 3;
        const additionalOffset = columnIndex > 0 ? 4 * columnIndex : 0;
        itemElement.style.left = `${offsetX + columnIndex * 60 + additionalOffset}px`;
        itemElement.style.top = `${offsetY + Math.floor(index / 3) * 60}px`;
        this.element.appendChild(itemElement);
      });
    }

    init() {
        //listen for the 'InventoryStateChange' event and update the inventory display
        document.addEventListener('InventoryStateChange', () => {
            this.display();
          });
    }
  }
  