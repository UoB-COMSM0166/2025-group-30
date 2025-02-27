class Grass {
    constructor() {
        this.size1 = 20;
        this.size2 = 40;
        this.x = random(width - this.size2);
        this.y = -this.size1;
        this.speed = random(2, 5);
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        fill(0, 255, 0);
        rect(this.x, this.y, this.size2, this.size1);
    }
} 