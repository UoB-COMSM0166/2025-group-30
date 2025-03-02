class GameStats {
    constructor(level = 1) {
        this.levelManager = new Level(level);
        this.score = 0;
        this.lives = new Lives(3); // 使用 Lives 类管理生命值
        
        // 从关卡管理器获取当前关卡信息
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timer = levelInfo.timer;
        this.timeLeft = this.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
    }

    // 重置到第一关
    resetToFirstLevel() {
        this.score = 0;
        this.lives.reset(); // 重置生命值为3
        
        // 重置到第一关
        this.levelManager.resetToFirstLevel();
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timeLeft = levelInfo.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
    }

    // 重置当前关卡（保持关卡数不变）
    resetCurrentLevel() {
        this.score = 0;
        this.lives.reset(); // 重置生命值为3
        
        // 重置当前关卡参数
        this.levelManager.resetCurrentLevel();
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timeLeft = levelInfo.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
    }

    // 更新关卡信息的方法
    updateLevelInfo() {
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timeLeft = levelInfo.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
        this.score = 0;
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
            this.lives.reset(); // 游戏结束时重置生命值为3
        }
        return gameOver;
    }

    displayUI() {
        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Level ${this.levelManager.currentLevel}`, width / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }

    displayLives() {
        this.lives.display();
    }
} 