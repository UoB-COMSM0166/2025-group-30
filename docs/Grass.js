class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = 40; //height
        this.w = 60; //width
        this.speed = 4;

        this.grassImage = null;
        this.loadImage();
    }

    fall() {
        this.y += this.speed;
    }

    draw() {
        image(this.grassImage, this.x, this.y, this.w, this.h);
    }

    loadImage() {
        this.grassImage = loadImage("assets/hay.webp");
    }
}