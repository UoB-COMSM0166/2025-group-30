class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 40; //height
        this.width = 60; //width
        this.speed = 4;
    }
    
    fall() {
        this.y += this.speed;
    }
    
    show() {
        fill(0, 255, 0);
        rect(this.x, this.y, this.width, this.height);
    }
}