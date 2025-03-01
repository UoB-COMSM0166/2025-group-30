class Single extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        this.player = new Player();
        this.basket = new Basket();
        
        this.level = level;
        this.targetScores = 10 * level; // 每个关卡目标分数递增
        this.timer = 30; // 每关限时30秒
        this.timeLeft = this.timer;
        this.grassDropDelay = 2000 - (level - 1) * 500; // 每关减少0.5s
        
        this.score = 0;
        this.grass = [];
        this.grassDropInterval = null;
        this.timerInterval = null;
        
        this.startGrassDrop();
        this.startLevelTimer();
        
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this.level, this.score, this.targetScores);
        this.gameOverScreen = new GameOverScreen(this.screenManager, this.level, this.score, this.targetScores);
    }

    display() {
        background(200);
        this.player.move();
        this.basket.show();
        
        this.updateGrass();
        this.displayLives();
        this.displayUI();
    }

    startGrassDrop() {
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval); }
        this.grass = [];

        this.grassDropInterval = setInterval(() => {
            this.grass.push(new Grass(random(200, width - 100), 10));
        }, this.grassDropDelay);
    }

    updateGrass() {
        for (let i = this.grass.length - 1; i >= 0; i--) {
            let grass = this.grass[i];
            grass.show();
            grass.fall();

            if (grass.pos.y > height) { 
                this.player.loseLife();
                this.grass.splice(i, 1);
            } else if (this.player.catchGrass(grass)) {
                this.grass.splice(i, 1);
            }
        }
    }

    emptyGrass() {
        if (this.player.x + this.player.w >= this.basket.position.x && 
            this.player.x <= this.basket.position.x + this.basket.size.x) {
            this.score += this.player.stack.length;
            this.player.stack = [];
        }
    }

    displayLives() {
        let heartX = 20, heartY = 120;
        for (let i = 0; i < 3; i++) {
            fill(i < this.player.lives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY, 20);
        }
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

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.emptyGrass();
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }

    reset() {
        this.timeLeft = this.timer;
        this.player.lives = 3;
        this.score = 0;
        this.grass = [];
    }

    startLevelTimer() {
        if (this.timerInterval) { clearInterval(this.timerInterval); }

        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                clearInterval(this.timerInterval);
                clearInterval(this.grassDropInterval);
                if (this.score >= this.targetScores) {
                    this.showLevelSuccess();
                } else {
                    this.showGameOver();
                }
            }
        }, 1000);
    }

    showLevelSuccess() {
        this.levelSuccessScreen.update(this.level, this.score, this.targetScores);
        this.screenManager.changeScreen(this.levelSuccessScreen);
    }
    
    showGameOver() {
        this.gameOverScreen.update(this.level, this.score, this.targetScores);
        this.screenManager.changeScreen(this.gameOverScreen);
    }
    
    levelUp() {
        if (this.level < 3) {
            this.level++;
            this.targetScores = 10 * this.level;
            this.timeLeft = 30;
            this.grassDropDelay = 2000 - (this.level - 1) * 500;
            this.score = 0;

            this.startGrassDrop();
            this.startLevelTimer();
        }
    }
}

