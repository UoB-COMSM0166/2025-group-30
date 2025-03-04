/**
 * 游戏统计类
 * 负责管理游戏状态、分数、生命值和关卡信息
 */
class GameStats {
    /**
     * 初始化游戏统计
     * @param {number} level - 初始关卡数
     */
    constructor(level = 1) {
        this.levelManager = new Level(level);
        this.score = 0;
        this.lives = new Lives(3);
        this.updateLevelInfo();
    }

    /**
     * 重置游戏到第一关
     * 清空分数并重置生命值
     */
    resetToFirstLevel() {
        this.score = 0;
        this.lives.reset();
        this.levelManager.resetToFirstLevel();
        this.updateLevelInfo();
    }

    /**
     * 重置当前关卡
     * 清空分数并重置生命值，但保持关卡不变
     */
    resetCurrentLevel() {
        this.score = 0;
        this.lives.reset();
        this.levelManager.resetCurrentLevel();
        this.updateLevelInfo();
    }

    /**
     * 更新当前关卡信息
     * 包括目标分数、剩余时间和草块生成间隔
     */
    updateLevelInfo() {
        const levelInfo = this.levelManager.getCurrentLevelInfo();
        this.targetScores = levelInfo.targetScore;
        this.timeLeft = levelInfo.timer;
        this.grassDropDelay = levelInfo.grassDropDelay;
    }

    /**
     * 增加游戏分数
     * @param {number} points - 要增加的分数
     */
    addScore(points) {
        this.score += points;
    }

    /**
     * 减少一条生命
     * @returns {boolean} 是否还有剩余生命
     */
    loseLife() {
        return this.lives.loseLife();
    }

    /**
     * 增加一条生命
     * @returns {boolean} 是否成功增加生命
     */
    gainLife() {
        return this.lives.gainLife();
    }

    /**
     * 减少剩余时间
     * @returns {number} 剩余时间
     */
    decrementTime() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
        }
        return this.timeLeft;
    }

    /**
     * 检查是否达到目标分数
     * @returns {boolean} 是否达到目标
     */
    hasReachedTarget() {
        return this.score >= this.targetScores;
    }

    /**
     * 检查游戏是否结束
     * @returns {boolean} 游戏是否结束
     */
    isGameOver() {
        const gameOver = !this.lives.isAlive() || this.timeLeft <= 0;
        if (gameOver) {
            this.lives.reset();
        }
        return gameOver;
    }

    /**
     * 显示游戏界面UI
     * 包括关卡、分数、目标分数、时间和生命值
     */
    displayUI() {
        fill(0);
        textSize(20);
        textAlign(LEFT);
        
        const baseWidth = 800;
        
        // 显示游戏信息
        text(`Level ${this.levelManager.currentLevel}`, baseWidth / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
        
        // 显示生命值图标
        let heartX = 20, heartY = 120;
        for (let i = 0; i < this.lives.maxLives; i++) {
            fill(i < this.lives.currentLives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
    }

    /**
     * 显示合作模式的游戏界面UI
     * 采用居中布局显示游戏信息
     */
    displayCoopUI() {
        const baseWidth = 800;
        
        // 显示关卡信息
        textAlign(CENTER);
        textSize(24);
        fill(0);
        text(`Level ${this.levelManager.currentLevel}`, baseWidth / 2, 30);
        
        // 显示总分
        textSize(32);
        text(`Score: ${this.score}`, baseWidth / 2, 70);
        
        // 显示目标分数
        textSize(24);
        text(`Target: ${this.targetScores}`, baseWidth / 2, 110);
        
        // 显示剩余时间
        text(`Time: ${this.timeLeft}s`, baseWidth / 2, 150);
        
        // 显示生命值图标
        let heartX = baseWidth / 2 - (this.lives.maxLives * 30) / 2;
        let heartY = 180;
        for (let i = 0; i < this.lives.maxLives; i++) {
            fill(i < this.lives.currentLives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
    }
} 