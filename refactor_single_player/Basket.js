class Basket {
    constructor(x = 0) {
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        this.size = { x: 80, y: 100 };
        this.position = { x: x, y: this.baseHeight - 100 };
        this.score = 0; // Store number of collected hay blocks
        
        console.log("Basket initialized, position:", this.position.x, this.position.y);
    }

    //Update basket score
    updateStats(collectedGrass) {
        this.score += collectedGrass; // Update score or hay block count
    }

    show() {
        fill(165, 42, 42);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

