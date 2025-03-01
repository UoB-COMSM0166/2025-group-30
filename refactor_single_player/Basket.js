class Basket {
    constructor(isLeft) {
        this.isLeft = isLeft;
        this.size = createVector(80, 100); // 统一存储大小
        this.position = createVector(
            isLeft ? width / 4 - this.size.x / 2 : (3 * width) / 4 - this.size.x / 2,
            height - 100
        );
    }

    show() {
        fill(165, 42, 42);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

