class Hay extends FallingObject {
    constructor(x, y) {
        super(x, y, 60, 40, 3);
        this.perfectStack = null; // Add property to track if this hay is part of a perfect stack
    }

    loadImage() {
        this.image = loadImage("assets/hay.webp");
    }

    isOffscreen() {
        return this.y > baseHeight;
    }

    setPerfectStack(value) {
        this.perfectStack = value;
    }
}