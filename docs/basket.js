class Basket {
    constructor(isLeft) {
        this.isLeft = isLeft;
        this.w = 50;
        this.h = 100;
        this.y = height - 100;
        this.x = isLeft ? 10 : width - 60;
    }

    show() {
        fill(165, 42, 42);
        rect(this.x, this.y, this.w, this.h);
    }
}