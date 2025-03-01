class Single extends Screen {
    constructor(screenManager, level = 1, targetScores = 5, timer = 10, grassDropDelay = 2000) {
        super(screenManager);

        this.player = new Player();
        this.basket = new Basket();

        this.level = level;
        this.targetScores = targetScores;
        this.timer = timer;
        this.timeLeft = timer;
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.score = 0;
        this.grass = []; // Collection of falling grass
        this.grassDropInterval = null;
        this.timerInterval = null;

        this.startGrassDrop(); // Start dropping grass immediately
        this.startLevelTimer(); // Start the level timer

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

        this.grass = []; // Empty the grass piles

        this.grassDropInterval = setInterval(() => {
            this.grass.push(new Grass(random(200, width - 100), 10));
        }, this.grassDropDelay); // Grass falls every 2 seconds     
    }

    updateGrass() {
        for (let i = this.grass.length - 1; i >= 0; i--) {
            let grass = this.grass[i];

            // 显示并更新草块
            grass.show();
            grass.fall();

            // 检查草块是否落到地面
            if (grass.pos.y > height) { 
                this.player.loseLife(); // 通过 `Player.js` 统一管理生命值逻辑
            }

            // 让玩家尝试接住草块
            if (grass.pos.y > height || this.player.catchGrass(grass)) {
                this.grass.splice(i, 1);  // 移除已接住或错过的草块
            }
        }
    }

    emptyGrass() { // Empty grass into the basket
        if (this.player.pos.x <= this.basket.pos.x + this.basket.w) {
            this.score += this.player.stack.length;
            this.player.stack = [];
            this.player.maxSpeed = 10;
            this.player.accelerationValue = 2;
        }
    }

    displayLives() {
        let heartX = 20;
        let heartY = 120;
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
        else if (keyCode === 32) this.emptyGrass(); // Spacebar      
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
                if (this.score >= this.targetScores) { // Move up a level
                    this.reset();
                    this.levelSuccessScreen.update(this.level, this.score, this.targetScores);
                    this.screenManager.changeScreen(this.levelSuccessScreen);
                } else { // Game over
                    this.reset();
                    this.gameOverScreen.update(this.level, this.score, this.targetScores);
                    this.screenManager.changeScreen(this.gameOverScreen);
                }
            }
        }, 1000);
    }

    showLevelSuccess() {
        this.levelSuccessScreen.update(this.level, this.score, this.targetScores);
        this.screenManager.changeScreen(this.levelSuccessScreen);
    }
    
    levelUp() { 
        this.level++;
        this.targetScores = 50;
        this.timer = 60;
        this.timeLeft = 60;
        this.grassDropDelay = 1500;
        this.score = 0;

        this.startGrassDrop();
        this.startLevelTimer();
    }
}
