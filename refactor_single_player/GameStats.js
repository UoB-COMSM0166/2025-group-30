class GameStats {
    constructor(level = 1) {
        this.level = level;
        this.score = 0;
        this.lives = 3;
        this.targetScores = 10 * level; // 每个关卡目标分数递增
        this.timer = 30; // 每关限时30秒
        this.timeLeft = this.timer;
        this.grassDropDelay = 2000 - (level - 1) * 500; // 每关减少0.5s
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.timeLeft = this.timer;
    }

    levelUp() {
        if (this.level < 3) {
            this.level++;
            this.targetScores = 10 * this.level;
            this.timeLeft = this.timer;
            this.grassDropDelay = 2000 - (this.level - 1) * 500;
            this.score = 0;
            return true;
        }
        return false;
    }

    addScore(points) {
        this.score += points;
    }

    loseLife() {
        this.lives--;
        return this.lives;
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
        return this.lives <= 0 || this.timeLeft <= 0;
    }

    displayUI() {
        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Level ${this.level}`, width / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }

    displayLives() {
        let heartX = 20, heartY = 120;
        for (let i = 0; i < 3; i++) {
            fill(i < this.lives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
    }
} 