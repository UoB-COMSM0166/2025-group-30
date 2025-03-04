class Coop extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        // Use fixed base dimensions
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // Create two players with different colors and positions
        this.player1 = new Player(1, 'red', 'left');
        this.player2 = new Player(2, 'blue', 'right');
        
        // Create shared basket in the left bottom corner
        this.basket = new Basket(0);
        
        // Create shared game stats
        this.stats = new GameStats(level);
        
        // Set stats for basket
        this.basket.setStats(this.stats);
        
        // Share the basket with players
        this.player1.basket = this.basket;
        this.player2.basket = this.basket;
        
        this.grass = [];
        this.grassDropInterval = null; // Controls grass falling timer
        this.timerInterval = null; // Controls level timer
        
        // Player controls
        this.controls = {
            player1: {
                left: 65, // A
                right: 68, // D
                drop: 32  // SPACE
            },
            player2: {
                left: 37, // LEFT ARROW
                right: 39, // RIGHT ARROW
                drop: 13  // ENTER
            }
        };
    }
    
    // Game objects rendering
    display() {
        background(200);
        
        this.player1.move();
        this.player2.move();
        
        this.player1.drawPlayer();
        this.player2.drawPlayer();
        
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
        
        // Set a short delay to generate the first grass block
        setTimeout(() => {
            this.grass.push(new Grass(random(200, this.baseWidth - 100), 10));
            
            // Then start normal grass generation interval
            this.grassDropInterval = setInterval(() => {
                this.grass.push(new Grass(random(200, this.baseWidth - 100), 10));
            }, this.stats.grassDropDelay);
        }, 1000); // First grass appears after 1 second
    }
    
    // Catch grass
    updateGrass() {
        for (let i = this.grass.length - 1; i >= 0; i--) {
            let grass = this.grass[i];
            grass.show();
            grass.fall();
            
            if (grass.y > this.baseHeight) { 
                // Grass hit the ground, lose a life
                this.player1.loseLife(false);
                this.player2.loseLife(false);
                this.stats.loseLife();
                this.grass.splice(i, 1);
                
                // Check if game is over
                if (!this.stats.lives.isAlive()) {
                    clearInterval(this.grassDropInterval);
                    clearInterval(this.timerInterval);
                    this.showGameOver();
                    return; // Exit loop immediately
                }
            } else if (this.player1.catchGrass(grass)) {
                // 玩家1接住草块
                if (this.player1.stack.length >= this.player1.maxStack) {
                    // 只清空玩家1的stack
                    this.player1.loseLife(true);
                    this.player2.loseLife(false); // 玩家2也闪烁暂停，但不清空stack
                    this.stats.loseLife();
                    
                    // Check if game is over
                    if (!this.stats.lives.isAlive()) {
                        clearInterval(this.grassDropInterval);
                        clearInterval(this.timerInterval);
                        this.showGameOver();
                        return; // Exit loop immediately
                    }
                }
                this.grass.splice(i, 1);
            } else if (this.player2.catchGrass(grass)) {
                // 玩家2接住草块
                if (this.player2.stack.length >= this.player2.maxStack) {
                    // 只清空玩家2的stack
                    this.player2.loseLife(true);
                    this.player1.loseLife(false); // 玩家1也闪烁暂停，但不清空stack
                    this.stats.loseLife();
                    
                    // Check if game is over
                    if (!this.stats.lives.isAlive()) {
                        clearInterval(this.grassDropInterval);
                        clearInterval(this.timerInterval);
                        this.showGameOver();
                        return; // Exit loop immediately
                    }
                }
                this.grass.splice(i, 1);
            }
        }
    }
    
    keyPressed() {
        // Player 1 Controls (AD + SPACE)
        if (keyCode === this.controls.player1.left) {
            this.player1.dir = -1;
        } else if (keyCode === this.controls.player1.right) {
            this.player1.dir = 1;
        } else if (keyCode === this.controls.player1.drop) {
            this.player1.dropGrass(); // 空格键触发Player 1的dropGrass
        }
        
        // Player 2 Controls (Arrow Keys + ENTER)
        if (keyCode === this.controls.player2.left) {
            this.player2.dir = -1;
        } else if (keyCode === this.controls.player2.right) {
            this.player2.dir = 1;
        } else if (keyCode === this.controls.player2.drop) {
            this.player2.dropGrass(); // 回车键触发Player 2的dropGrass
        }
        
        // ESC键暂停游戏
        if (keyCode === ESCAPE) {
            this.pauseGame();
        }
    }
    
    keyReleased() {
        // Player 1 Controls
        if (keyCode === this.controls.player1.left && this.player1.dir === -1) {
            this.player1.dir = 0;
        } else if (keyCode === this.controls.player1.right && this.player1.dir === 1) {
            this.player1.dir = 0;
        }
        
        // Player 2 Controls
        if (keyCode === this.controls.player2.left && this.player2.dir === -1) {
            this.player2.dir = 0;
        } else if (keyCode === this.controls.player2.right && this.player2.dir === 1) {
            this.player2.dir = 0;
        }
    }
    
    startLevelTimer() {
        if (this.timerInterval) { 
            clearInterval(this.timerInterval); 
        }
        
        // Update timer every second
        this.timerInterval = setInterval(() => {
            this.stats.decrementTime();
            
            // Check for timeout
            if (this.stats.timeLeft <= 0) {
                clearInterval(this.grassDropInterval);
                clearInterval(this.timerInterval);
                
                if (this.stats.hasReachedTarget()) {
                    this.showLevelSuccess();
                } else {
                    this.showGameOver();
                }
            }
        }, 1000);
    }
    
    showLevelSuccess() {
        this.screenManager.levelSuccessScreen.update(this.stats.levelManager.currentLevel, this.stats.score, this.stats.targetScores);
        this.screenManager.changeScreen(this.screenManager.levelSuccessScreen);
    }
    
    showGameOver() {
        this.screenManager.gameOverScreen.update(this.stats.levelManager.currentLevel, this.stats.score, this.stats.targetScores);
        this.screenManager.changeScreen(this.screenManager.gameOverScreen);
    }
    
    levelUp() {
        if (this.stats.levelManager.levelUp()) {
            // Update game state
            this.stats.updateLevelInfo();
            
            // Reset score (we want to start from 0 in the new level)
            this.stats.score = 0;
            
            // Reset lives
            this.stats.lives.reset();
            
            // Clean up current level state
            if (this.grassDropInterval) {
                clearInterval(this.grassDropInterval);
                this.grassDropInterval = null;
            }
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            // Reset players' states
            this.grass = [];
            this.player1.resetPosition();
            this.player2.resetPosition();
            
            // Start new level
            this.startGame();
            return true;
        } else {
            // If no more levels, show level success
            this.showLevelSuccess();
            return false;
        }
    }
    
    retryCurrentLevel() {
        // Reset game state for current level
        this.stats.resetCurrentLevel();
        
        // Clean up
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset players
        this.grass = [];
        this.player1.resetPosition();
        this.player2.resetPosition();
        this.player1.stack = [];
        this.player2.stack = [];
        
        // Start game again
        this.startGame();
    }
    
    startNewGame() {
        // Reset to first level
        this.stats.resetToFirstLevel();
        
        // Clean up
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset players
        this.grass = [];
        this.player1.resetPosition();
        this.player2.resetPosition();
        
        // Start game
        this.startGame();
    }
    
    // 添加emptyGrass方法处理得分更新
    emptyGrass(points) {
        // 直接使用传入的points更新分数
        this.stats.addScore(points);
        
        // 检查是否达到目标分数
        if (this.stats.hasReachedTarget()) {
            clearInterval(this.grassDropInterval);
            clearInterval(this.timerInterval);
            this.showLevelSuccess();
        }
    }
    
    // 暂停游戏
    pauseGame() {
        // 停止所有计时器
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 暂停所有草的下落
        for (let grass of this.grass) {
            grass.pause();
        }
        
        // 设置当前屏幕为上一个屏幕并切换到暂停界面
        this.screenManager.pauseScreen.setLastScreen(this);
        this.screenManager.changeScreen(this.screenManager.pauseScreen);
    }
    
    // 恢复游戏
    resumeGame() {
        // 重新启动计时器，但不重新生成草
        if (!this.grassDropInterval) {
            // 只创建生成草的定时器，不清空现有的草
            this.grassDropInterval = setInterval(() => {
                this.grass.push(new Grass(random(200, this.baseWidth - 100), 10));
            }, this.stats.grassDropDelay);
        }
        
        if (!this.timerInterval) {
            this.startLevelTimer();
        }
        
        // 恢复所有草的下落
        for (let grass of this.grass) {
            grass.resume();
        }
    }
    
    // 重新开始游戏，用于从暂停菜单调用
    reset() {
        // 重置游戏状态
        this.stats.reset();
        
        // 清理所有计时器
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 重置玩家和草
        this.grass = [];
        this.player1.resetPosition();
        this.player2.resetPosition();
        this.player1.stack = [];
        this.player2.stack = [];
        
        // 注意：reset后需要单独调用startGame
    }
} 