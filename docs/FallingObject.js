class FallingObject {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.image = null;
        this.loadImage();
    }

    loadImage() {
        // This method should be overridden by subclasses
    }

    fall() {
        this.y += this.speed;
    }

    draw() {
        image(this.image, this.x, this.y, this.w, this.h);
    }

    isOffscreen() {
        return this.y > baseHeight;
    }
} 