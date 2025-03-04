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
        
        // Share the basket with players
        this.player1.basket = this.basket;
        this.player2.basket = this.basket;
        
        // Create shared game stats
        this.stats = new GameStats(level);
        
        this.grass = [];
        this.grassDropInterval = null; // Controls grass falling timer
        this.timerInterval = null; // Controls level timer

        // 设置全局的更新分数函数，供Player类使用
        const self = this;
        window.updateScore = function(points, playerId) {
            self.emptyGrass(points);
        };
        
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
            } else if (this.player1.catchGrass(grass) || this.player2.catchGrass(grass)) {
                // Either player caught the grass
                if (this.player1.stack.length >= this.player1.maxStack || 
                    this.player2.stack.length >= this.player2.maxStack) {
                    // Stack exceeds limit, lose a life
                    this.player1.loseLife(true);
                    this.player2.loseLife(true);
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
        // 更新得分
        this.stats.addScore(points);
        
        // 检查是否达到目标分数
        if (this.stats.hasReachedTarget()) {
            clearInterval(this.grassDropInterval);
            clearInterval(this.timerInterval);
            this.showLevelSuccess();
        }
    }
} 