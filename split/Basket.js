class Basket {
    constructor(isLeft) {
        this.isLeft = isLeft;
        this.w = 50;
        this.h = 100;
        this.y = height - 100;
        this.x = isLeft ? 10 : width - 60;
        //this.active = isLeft; 
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