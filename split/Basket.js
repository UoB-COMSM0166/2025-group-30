class Basket {
    constructor(isLeft) {
        this.w = 100;
        this.h = 60;
        this.x = isLeft ? 50 : width - 150;
        this.y = height - this.h;
    }

    draw() {
        fill(139, 69, 19);  // 棕色
        rect(this.x, this.y, this.w, this.h);
    }
} 