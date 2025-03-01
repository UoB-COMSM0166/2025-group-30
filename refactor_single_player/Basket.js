class Basket {
    constructor() {
        this.size = { x: 80, y: 100 };
        this.position = { x: width / 2 - this.size.x / 2, y: height - 100 };
        this.score = 0; // 存储篮子内的草块数量
    }

    //更新篮子分数
    updateStats(collectedGrass) {
        this.score += collectedGrass; // 更新得分或草块数量
    }

    show() {
        fill(165, 42, 42);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

