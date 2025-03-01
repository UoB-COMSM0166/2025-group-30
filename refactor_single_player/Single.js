class Single extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        this.player = new Player();
        this.basket = new Basket();
        this.stats = new GameStats(level);
        
        this.grass = [];
        this.grassDropInterval = null;
        this.timerInterval = null;
        
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this.stats.level, this.stats.score, this.stats.targetScores);
        this.gameOverScreen = new GameOverScreen(this.screenManager, this.stats.level, this.stats.score, this.stats.targetScores);
    }

    display() {
        background(200);
        this.player.move();
        this.player.drawPlayer();
        this.basket.show();
        
        this.updateGrass();
        this.stats.displayLives();
        this.stats.displayUI();
    }

    startGame() {
        this.startGrassDrop();
        this.startLevelTimer();
    }

    startGrassDrop() {
        if (this.grassDropInterval) { 
            clearInterval(this.grassDropInterval); 
        }
        this.grass = [];
        
        // 设置一个较短的延迟来生成第一个草块
        setTimeout(() => {
            this.grass.push(new Grass(random(200, width - 100), 10));
            
            // 然后开始正常的草块生成间隔
            this.grassDropInterval = setInterval(() => {
                this.grass.push(new Grass(random(200, width - 100), 10));
            }, this.stats.grassDropDelay);
        }, 1000); // 第一个草块1秒后出现
    }

    updateGrass() {
        for (let i = this.grass.length - 1; i >= 0; i--) {
            let grass = this.grass[i];
            grass.show();
            grass.fall();

            if (grass.y > height) { 
                this.player.loseLife(false);
                this.stats.loseLife();
                this.grass.splice(i, 1);
                if (this.stats.lives <= 0) {
                    clearInterval(this.grassDropInterval);
                    clearInterval(this.timerInterval);
                    this.showGameOver();
                }
            } else if (this.player.catchGrass(grass)) {
                if (this.player.stack.length >= this.player.maxStack) {
                    this.player.loseLife(true);
                    this.stats.loseLife();
                    if (this.stats.lives <= 0) {
                        clearInterval(this.grassDropInterval);
                        clearInterval(this.timerInterval);
                        this.showGameOver();
                    }
                }
                this.grass.splice(i, 1);
            }
        }
    }

    emptyGrass() {
        if (this.player.x + this.player.w >= this.basket.position.x && 
            this.player.x <= this.basket.position.x + this.basket.size.x) {
            this.stats.addScore(this.player.stack.length);
            this.player.stack = [];
        }
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
        this.stats.reset();
        this.grass = [];
        this.player.resetPosition();
        this.player.stack = [];
        
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startLevelTimer() {
        if (this.timerInterval) { clearInterval(this.timerInterval); }

        this.timerInterval = setInterval(() => {
            const timeLeft = this.stats.decrementTime();
            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                clearInterval(this.grassDropInterval);
                if (this.stats.hasReachedTarget()) {
                    this.showLevelSuccess();
                } else {
                    this.showGameOver();
                }
            }
        }, 1000);
    }

    showLevelSuccess() {
        this.levelSuccessScreen.update(this.stats.level, this.stats.score, this.stats.targetScores);
        this.screenManager.changeScreen(this.levelSuccessScreen);
    }
    
    showGameOver() {
        this.gameOverScreen.update(this.stats.level, this.stats.score, this.stats.targetScores);
        this.screenManager.changeScreen(this.gameOverScreen);
    }
    
    levelUp() {
        if (this.stats.levelUp()) {
            this.startGrassDrop();
            this.startLevelTimer();
        }
    }
}

