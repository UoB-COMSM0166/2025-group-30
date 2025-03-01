class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = { x: 60, y: 40 }; // 统一使用普通对象存储宽高
        this.speed = 4;  // 草块下落速度
    }

    fall() {
        this.y += this.speed;  // 让草块向下移动，可以在这里设定下落速度随关卡的变化
    }

    show() {
        fill(0, 255, 0);  // 设定草块的颜色为绿色
        rect(this.x, this.y, this.size.x, this.size.y);  // 绘制草块
    }
}
