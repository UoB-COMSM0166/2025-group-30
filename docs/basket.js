class Basket {
    constructor() {
        this.x = 30;
        this.y = height - 100;
        this.w = 100;
        this.h = 100;
    }

    show() {
        fill(165, 42, 42);
        rect(this.x, this.y, this.w, this.h);
    }
}
