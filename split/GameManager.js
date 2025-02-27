class GameManager {
    constructor() {
        this.state = new GameState();
        this.uiManager = new UIManager(this);
        this.inputHandler = new InputHandler(this);
        this.grassDropInterval = null;
        this.levelTimerInterval = null;
        this.moveDirection1 = 0;
        this.moveDirection2 = 0;
        this.flashTimer1 = 0;
        this.flashTimer2 = 0;
        this.grassPiles = [];
        
        // 创建两个篮子
        this.basket1 = new Basket(true);
        this.basket2 = new Basket(false);
        
        // 初始化玩家
        this.player1 = new Player(width / 4, height - 150, true);
        this.player2 = new Player(3 * width / 4, height - 150, false);
        
        // 设置玩家和篮子的关联
        this.player1.gameManager = this;
        this.player2.gameManager = this;
        this.player1.basket = this.basket1;
        this.player2.basket = this.basket2;
        
        this.setup();
        //console.log("Basket 1 position: x=" + this.basket1.x);
        //console.log("Basket 2 position: x=" + this.basket2.x);

    }

    setup() {
        this.updateGameMode(); // 在构造函数中调用
        ////console.log("Current game mode - isPlayAgainstMode:", this.state.isPlayAgainstMode); // 添加调试信息

    }

    updateGameMode() {
        //console.log("Current game mode - isPlayAgainstMode:", this.player1.w); // 添加调试信息
        if (this.state.isPlayAgainstMode) {
             // 对抗模式下激活两个篮子
             this.basket1.active = true;
             this.basket2.active = true;
 
            // 重新设置玩家位置和篮子引用
            //this.player1.resetPosition(true);
            // this.player2.resetPosition(false);
 
             this.player1.basket = this.basket1;
             this.player2.basket = this.basket2;
 
             //console.log("Player 1 basket:", this.player1.basket);
             //console.log("Player 2 basket:", this.player2.basket); // 确保玩家2的 basket 指向 basket2
        } else {
            // 单人或合作模式下只激活左边篮子
            this.basket1.active = true;
            this.basket2.active = false;

            // 在合作模式下，两个玩家都使用左边的篮子
            this.player1.basket = this.basket1;
            this.player2.basket = this.basket1;
        }
    }

    startGrassDrop() {
        if (!this.state.gameStarted) return;
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        this.grassPiles = [];
        this.grassDropInterval = setInterval(() => {
            if (!this.state.gameOver && !this.state.paused && this.state.startGame) {
                if (this.state.isPlayAgainstMode) {
                    this.grassPiles.push(new Grass(random(50, width / 2 - 50), 10, true));
                    this.grassPiles.push(new Grass(random(width / 2 + 50, width - 50), 10, false));
                } else {
                    this.grassPiles.push(new Grass(random(50, width - 50), 10, true));
                }
            }
        }, 2000);
        this.startLevelTimer();
    }

    startLevelTimer() {
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.state.timer = 30;
        this.levelTimerInterval = setInterval(() => {
            if (!this.state.paused && this.state.startGame) {
                this.state.timer--;
                if (this.state.timer <= 0) {
                    this.handleTimeUp();
                }
            }
        }, 1000);
    }

    handleTimeUp() {
        clearInterval(this.levelTimerInterval);
        if (this.state.isPlayAgainstMode) {
            this.state.gameOver = true;
        } else {
            if (this.state.score1 + this.state.score2 >= 
                this.state.targetScores[this.state.level - 1]) {
                this.state.showLevelUpScreen = true;
                this.state.paused = true;
            } else {
                this.state.gameOver = true;
            }
        }
    }

    update() {
            
        // 更新闪烁计时器
        this.updateFlashTimers();
        if (this.state.paused || !this.state.gameStarted) return;
        this.updateGameMode();
        this.updateGrassPiles();
    
        // 更新玩家位置
        this.updatePlayers();
    
        // 更新草方块
        

        

        
    }



    levelUp() {
        if (this.state.level < this.state.targetScores.length) {
            this.state.level++;
            this.state.showLevelUpScreen = false;
            this.state.paused = false;
            this.resetPlayers();
            this.startGrassDrop();
        } else {
            this.state.gameOver = true;
        }
    }

    restartGame() {
        // 保存当前模式设置
        const currentMode = this.state.mode;
        const isTwoPlayer = this.state.isTwoPlayerMode;
        const isPlayAgainst = this.state.isPlayAgainstMode;
    
        // 重置状态
        this.state.reset();
        
        // 恢复模式设置
        this.state.mode = currentMode;
        this.state.isTwoPlayerMode = isTwoPlayer;
        this.state.isPlayAgainstMode = isPlayAgainst;
    
        // 根据模式设置篮子状态
        if (this.state.isPlayAgainstMode) {
            this.basket1.active = true;
            this.basket2.active = true;
        } else {
            this.basket1.active = true;
            this.basket2.active = false;
        }
    
        if (this.state.isPlayAgainstMode) {
            // 对抗模式下的重置
            this.basket1 = new Basket(true);
            this.basket2 = new Basket(false);
            
            this.player1 = new Player(60, height - 50, true);
            this.player2 = new Player(width - 160, height - 50, false);
            
            // 设置玩家的gameManager引用
            this.player1.gameManager = this;
            this.player2.gameManager = this;
            
            // 设置篮子引用
            this.player1.basket = this.basket1;
            this.player2.basket = this.basket2; // 确保玩家2的 basket 指向 basket2
        }
    }

    updatePlayers() {
        if (this.state.paused || !this.state.gameStarted) return;
    
        // 更新玩家1
        if (this.player1) {
            this.player1.update();  // 使用update方法而不是move
        }
    
        // 更新玩家2
        if (this.player2) {
            this.player2.update();  // 使用update方法而不是move
        }
    }

    updateGrassPiles() {
        for (let i = this.grassPiles.length - 1; i >= 0; i--) {
            let grass = this.grassPiles[i];
            grass.update();
    
            // 检查是否被玩家1接住
            if (this.player1.catchGrass(grass)) {
                this.grassPiles.splice(i, 1);
                continue;
            }
    
            // 如果是双人模式，检查是否被玩家2接住
            if (this.state.isTwoPlayerMode && this.player2.catchGrass(grass)) {
                this.grassPiles.splice(i, 1);
                continue;
            }
    
            // 检查是否掉出屏幕
            if (grass.y > height) {
                // 在对抗模式下
                if (this.state.isPlayAgainstMode) {
                    // 根据草方块在屏幕的左右位置决定减少哪个玩家的生命值
                    if (grass.x < width / 2) {
                        this.state.lives1--;
                        this.flashTimer1 = 60; // 闪烁效果
                    } else {
                        this.state.lives2--;
                        this.flashTimer2 = 60; // 闪烁效果
                    }
                } 
                // 在单人模式或双人合作模式下
                else {
                    // 减少所有玩家的生命值
                    this.state.lives1--;
                    this.flashTimer1 = 60;
                    if (this.state.isTwoPlayerMode) {
                        this.state.lives2--;
                        this.flashTimer2 = 60;
                    }
                }
    
                // 暂停游戏并触发闪烁效果
                this.state.paused = true;
    
                // 检查游戏是否结束
                if (this.state.lives1 <= 0 || this.state.lives2 <= 0) {
                    this.state.gameOver = true;
                    if (this.grassDropInterval) {
                        clearInterval(this.grassDropInterval);
                    }
                    if (this.levelTimerInterval) {
                        clearInterval(this.levelTimerInterval);
                    }
                }
    
                // 移除掉落的草方块
                this.grassPiles.splice(i, 1);
            }
        }
    }

    updateFlashTimers() {
        if (this.flashTimer1 > 0 && !this.state.flashPaused) {
            this.updateFlashTimer1();
        }
        if (this.flashTimer2 > 0 && !this.state.flashPaused) {
            this.updateFlashTimer2();
        }
    }

    updateFlashTimer1() {
            this.flashTimer1--;
            this.state.isFlashVisible = frameCount % 10 < 5; // 闪烁效果
            if (this.flashTimer1 === 0 && this.state.lives1 > 0) {
                this.player1.paused = false;
                this.state.paused = false;
                this.state.isFlashVisible = true; // 闪烁结束后恢复可见
            } else if (this.flashTimer1 === 0 && this.state.lives1 <= 0) {
                this.state.gameOver = true;
            }
    }

    
    updateFlashTimer2() {
            this.flashTimer2--;
            this.state.isFlashVisible = frameCount % 10 < 5; // 闪烁效果
            if (this.flashTimer2 === 0 && this.state.lives2 > 0) {
                this.player2.paused = false;
                this.state.paused = false;
                this.state.isFlashVisible = true; // 闪烁结束后恢复可见
            } else if (this.flashTimer2 === 0 && this.state.lives2 <= 0) {
                this.state.gameOver = true;
            }
    }


    resetPlayers() {
        if (this.player1) {
            this.player1.paused = false;
            this.player1.resetPosition(true);
            this.player1.stack = [];
        }
        if (this.player2) {
            this.player2.paused = false;
            this.player2.resetPosition(false);
            this.player2.stack = [];
        }
        this.moveDirection1 = 0;
        this.moveDirection2 = 0;
        this.flashTimer1 = 0;
        this.flashTimer2 = 0;
    }
}