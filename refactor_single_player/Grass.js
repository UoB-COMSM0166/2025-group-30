class Grass {
    constructor(x, y) {
        this.pos = createVector(x, y);  // 使用向量存储草的坐标
        this.size = createVector(60, 40); // 使用向量存储宽度和高度 (width, height)
        this.speed = 4;  // 草块下落速度
    }

    fall() {
        this.pos.y += this.speed;  // 让草块向下移动
    }

    show() {
        fill(0, 255, 0);  // 设定草块的颜色为绿色
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);  // 绘制草块
    }

}
