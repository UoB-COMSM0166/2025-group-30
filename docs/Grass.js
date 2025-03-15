class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = 40; //height
        this.w = 60; //width
        this.speed = 4;
    }
    
    fall() {
        this.y += this.speed;
    }
    
    draw() {
        stroke(0);
        fill(0, 255, 0);
        rectMode(LEFT);
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    }
}