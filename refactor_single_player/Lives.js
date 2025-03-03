class Lives {
    constructor(maxLives = 3) {
        this.maxLives = maxLives;
        this.currentLives = maxLives;
    }

    // 减少生命值
    loseLife() {
        if (this.currentLives > 0) {
            this.currentLives--;
        }
        return this.currentLives;
    }

    // 增加生命值
    gainLife() {
        if (this.currentLives < this.maxLives) {
            this.currentLives++;
        }
        return this.currentLives;
    }

    // 重置生命值
    reset() {
        this.currentLives = this.maxLives;
    }

    // 检查是否还有生命
    isAlive() {
        return this.currentLives > 0;
    }

    // 获取当前生命值
    getLives() {
        return this.currentLives;
    }
} 