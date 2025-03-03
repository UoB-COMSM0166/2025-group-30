class GameStats {
    constructor(level = 1) {
        this.levelManager = new Level(level);
        this.score = 0;
        this.lives = new Lives(3);
        this.updateLevelInfo();
    }

    // 重置到第一关
    resetToFirstLevel() {
        this.score = 0;
        this.lives.reset();
        this.levelManager.resetToFirstLevel();
        this.updateLevelInfo();
    }

    // 重置当前关卡（保持关卡数不变）
    resetCurrentLevel() {
        this.score = 0;
        this.lives.reset();
        this.levelManager.resetCurrentLevel();
        this.updateLevelInfo();
    }

    // 更新关卡信息的方法
    updateLevelInfo() {
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timeLeft = levelInfo.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
    }

    addScore(points) {
        this.score += points;
    }

    loseLife() {
        return this.lives.loseLife();
    }

    gainLife() {
        return this.lives.gainLife();
    }

    decrementTime() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        }
        return this.timeLeft;
    }

    hasReachedTarget() {
        return this.score >= this.targetScores;
    }

    isGameOver() {
        const gameOver = !this.lives.isAlive() || this.timeLeft <= 0;
        if (gameOver) {
            this.lives.reset();
        }
        return gameOver;
    }

    displayUI() {
        fill(0);
        textSize(20);
        textAlign(LEFT);
        
        // 使用固定的基准尺寸
        const baseWidth = 800;
        
        // 显示关卡、分数、目标分数和时间
        text(`Level ${this.levelManager.currentLevel}`, baseWidth / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
        
        // 显示生命值
        let heartX = 20, heartY = 120;
        for (let i = 0; i < this.lives.maxLives; i++) {
            fill(i < this.lives.currentLives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
    }
} 