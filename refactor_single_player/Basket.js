class Basket {
    constructor(isLeft) { //ifLeft is only applicable to pvp mode
        this.isLeft = isLeft;

        this.x = isLeft ? 10 : width - 60;
        this.y = height - 100;

        this.w = 100;
        this.h = 100;

        this.active = true; // 默认篮子激活
    }

    show() {
        // 只有在激活状态下才显示篮子
        if (this.active) {
            fill(165, 42, 42);
            rect(this.x, this.y, this.w, this.h);
        }
    }
}
