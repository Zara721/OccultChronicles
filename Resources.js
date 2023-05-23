class Resources {
    constructor() {
        
    }

    update() {
        // Iterate over the resources object in gameState and update each element with corresponding value
        Object.entries(window.gameState.resources).forEach(([key, value]) => {
            this.updateResourceElement(key, value);
        });
    }

    updateResourceElement(id, value) {
        // Creates the element and gives the id based on the element name
        const element = document.getElementById(id);
        
        // If the element exists, update the values stored 
        if (element) {
            element.textContent = value;
            this.updateGameStateResources(id, value);
        }
    }

    updateGameStateResources(key, value) {
        window.gameState.resources[key] = value;
    }

    createElement(id, value) {
        // Create a new div element and set its id and the text it will display
        const element = document.createElement('div');
        element.id = id;
        element.textContent = value;
        return element;
    }

    changeResource(resource, amount) {
        const newValue = window.gameState.resources[resource] + amount;
        this.updateGameStateResources(resource, newValue);

        // use custom event to trigger the update in the display
        utils.emitEvent("resourceStateChange");;
    }

    init(container) {
        // Iterate over the resources object in gameState and create a new element for each key-value pair
        Object.entries(window.gameState.resources).forEach(([key, value]) => {
            const element = this.createElement(key, value);
            container.appendChild(element);
        });

        // Check for custom event 'resourceStateChange' and update accordingly
        document.addEventListener('resourceStateChange', () => {
            this.update();
        });
    }
}

