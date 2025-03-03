class Basket {
    constructor() {
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        this.size = { x: 80, y: 100 };
        this.position = { x: 0, y: this.baseHeight - 100 };
        this.score = 0; // 存储篮子内的草块数量
        
        console.log("Basket初始化完成, 位置:", this.position.x, this.position.y);
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

