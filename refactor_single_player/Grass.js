class Grass {
    constructor(x, y, isLeft) {
        this.x = x;
        this.y = y;
        this.h = 40; //height
        this.w = 60; //width
        this.speed = 4;

        this.isLeft = isLeft;
    }
    
    fall() {
        this.y += this.speed;
    }
    
    show() {
        stroke(0);
        fill(0, 255, 0);
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    }
}