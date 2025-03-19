class Basket {
    constructor(position = "left") { //ifLeft is only applicable to pvp mode
        this.position = position;

        if (this.position === "left") this.x = 10;
        else if (this.position === "right") this.x = baseWidth - 60;
        this.y = baseHeight- 100;

        this.w = 50;
        this.h = 100;

        // 添加分数相关属性
        this.score = 0;
        this.targetScore = 0;
    }

    draw() {
        // 计算每个格子的高度
        let segmentHeight = this.h / (this.targetScore || 1); // 如果没有目标分数，使用1作为默认值
        
        // 绘制篮子背景（红色）
        fill(165, 42, 42);
        rect(this.x, this.y, this.w, this.h);

        // 绘制已得分的部分（绿色）
        if (this.score > 0) {
            fill(42, 165, 42);
            // 如果没有目标分数，则根据得分比例填充
            if (this.targetScore === 0) {
                let ratio = min(this.score / 10, 1); // 假设10分为满分
                rect(this.x, this.y + this.h - (this.h * ratio), this.w, this.h * ratio);
            } else {
                // 如果有目标分数，则按原来的逻辑显示
                let displayScore = min(this.score, this.targetScore);
                rect(this.x, this.y + this.h - (segmentHeight * displayScore), this.w, segmentHeight * displayScore);
            }
        }

        // 在篮子上方显示分数
        fill(0);
        textSize(16);
        textAlign(CENTER);
        if (this.targetScore === 0) {
            // 如果没有目标分数，只显示当前分数
            text(`${this.score}`, this.x + this.w/2, this.y - 10);
        } else if (this.score >= this.targetScore) {
            // 显示Target Achieved在分数上方，并向右移动
            text("Target Achieved!", this.x + this.w/2 + 35, this.y - 35);
            text(`${this.score}/${this.targetScore}`, this.x + this.w/2, this.y - 10);
        } else {
            text(`${this.score}/${this.targetScore}`, this.x + this.w/2, this.y - 10);
        }
    }

    // 更新分数的方法
    updateScore(score, targetScore) {
        this.score = score;
        this.targetScore = targetScore;
    }
}
