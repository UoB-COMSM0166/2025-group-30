class Basket {
    constructor(position = "left") {
        this.position = position;
        this.x = (position === "left") ? 10 : baseWidth - 160;
        console.log(baseWidth);
        this.y = baseHeight - 150;
        this.w = 150;
        this.h = 150;
        this.score = 0;
        this.targetScore = 0;
    }

    draw() {
        push(); // 保存当前绘图状态
        
        // 根据得分设置颜色
        if (this.targetScore === 0) {
            tint(255); 
        } else {
            let progress = min(this.score / this.targetScore, 1);
            // 从灰色(128,128,128)变化到原色(255,255,255)
            let grayValue = lerp(128, 255, progress);
            tint(grayValue, grayValue, grayValue);
        }

        // 绘制带颜色的篮子图片
        if (Basket.basketImage) {
            image(Basket.basketImage, this.x, this.y, this.w, this.h);
        }
        
        pop(); // 恢复绘图状态

        // 显示分数
        fill(255);
        textSize(20);
        stroke(0);
        strokeWeight(2);
        textStyle(BOLD);
        textAlign(CENTER);
        if (this.targetScore === 0) {
            text(`${this.score}`, this.x + this.w/2, this.y - 10);
        } else if (this.score >= this.targetScore) {
            text("Target Achieved!", this.x + this.w/2 +5, this.y - 35);
            text(`${this.score}/${this.targetScore}`, this.x + this.w/2, this.y - 10);
        } else {
            text(`${this.score}/${this.targetScore}`, this.x + this.w/2, this.y - 10);
        }
        noStroke();
        textStyle(NORMAL);
        
    }

    updateScore(score, targetScore) {
        this.score = score;
        this.targetScore = targetScore;
    }
}
