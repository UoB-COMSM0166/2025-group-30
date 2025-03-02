class Lives {
    constructor(initialLives = 3) {
        this.maxLives = initialLives;
        this.currentLives = initialLives;
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

    // 显示生命值UI
    display() {
        let heartX = 20, heartY = 120;
        for (let i = 0; i < this.maxLives; i++) {
            fill(i < this.currentLives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
    }
} 