class Single extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        this.player = new Player();
        this.basket = new Basket();
        this.stats = new GameStats(level);
        
        this.grass = [];
        this.grassDropInterval = null;//控制草块掉落的定时器
        this.timerInterval = null;//控制关卡计时的定时器
        
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this.stats.level, this.stats.score, this.stats.targetScores);//创建一个关卡成功的屏幕对象
        this.gameOverScreen = new GameOverScreen(this.screenManager, this.stats.level, this.stats.score, this.stats.targetScores);//创建一个游戏失败的屏幕对象
    }
    //游戏对象渲染
    display() {
        background(200);
        this.player.move();
        this.player.drawPlayer();
        this.basket.show();
        
        this.updateGrass();
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

    //接草
    updateGrass() {
        for (let i = this.grass.length - 1; i >= 0; i--) {
            let grass = this.grass[i];
            grass.show();
            grass.fall();

            if (grass.y > height) { 
                // 草块落地，失去一条命
                this.player.loseLife(false);
                this.stats.loseLife();
                this.grass.splice(i, 1);
                
                // 检查游戏是否结束
                if (!this.stats.lives.isAlive()) {
                    clearInterval(this.grassDropInterval);
                    clearInterval(this.timerInterval);
                    this.showGameOver();
                    return; // 立即退出循环
                }
            } else if (this.player.catchGrass(grass)) {
                if (this.player.stack.length >= this.player.maxStack) {
                    // 堆叠超过上限，失去一条命
                    this.player.loseLife(true);
                    this.stats.loseLife();
                    
                    // 检查游戏是否结束
                    if (!this.stats.lives.isAlive()) {
                        clearInterval(this.grassDropInterval);
                        clearInterval(this.timerInterval);
                        this.showGameOver();
                        return; // 立即退出循环
                    }
                }
                this.grass.splice(i, 1);
            }
        }
    }

    //把草倒入篮子
    emptyGrass() {
        if (this.player.x + this.player.w >= this.basket.position.x && 
            this.player.x <= this.basket.position.x + this.basket.size.x) {
            this.stats.addScore(this.player.stack.length);
            this.player.stack = [];
            
            // 检查是否达到目标分数
            if (this.stats.hasReachedTarget()) {
                clearInterval(this.grassDropInterval);
                clearInterval(this.timerInterval);
                this.showLevelSuccess();
            }
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

    //重新开始游戏
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
        if (this.stats.levelManager.levelUp()) {
            // 更新游戏状态
            this.stats.updateLevelInfo();
            
            // 重置分数（保留这一步，因为我们想在新关卡中从0分开始）
            this.stats.score = 0;
            
            // 重置生命值
            this.stats.lives.reset();
            
            // 清理当前关卡的状态
            if (this.grassDropInterval) {
                clearInterval(this.grassDropInterval);
                this.grassDropInterval = null;
            }
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            // 重置玩家状态
            this.grass = [];
            this.player.resetPosition();
            this.player.stack = [];
            
            // 开始新关卡
            this.startGame();
            return true;
        }
        return false;
    }

    // 重试当前关卡
    retryCurrentLevel() {
        // 重置游戏状态，但保持当前关卡难度
        this.stats.resetCurrentLevel();
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
        
        // 开始游戏
        this.startGame();
    }

    // 从第一关开始新游戏
    startNewGame() {
        this.stats.resetToFirstLevel();
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
        
        // 开始游戏
        this.startGame();
    }
}

