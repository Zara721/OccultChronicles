class NameTag {
    constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.ctx = config.ctx;
    }

    
    displayName() {
        
        this.ctx.fillStyle = 'rgba(109, 109, 109, 0.7)'; 
        const textWidth = this.ctx.measureText(this.name).width; // adda in appropiately sized background
        const padding = 4; //dynamic padding
        this.ctx.fillRect(this.x - padding, this.y - 10 - padding, textWidth + 2 * padding, 14 + 2 * padding);

        this.ctx.textRendering = "geometricPrecision"; // Make the text show up less pixelated
        this.ctx.fillStyle = '#d1c3d1';
        this.ctx.font = '14px Poppins';
        this.ctx.fillText(this.name, this.x, this.y); // Draw Name above character sprite

    }
}