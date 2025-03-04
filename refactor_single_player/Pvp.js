/**
 * 对战模式类
 * 负责处理双人对战模式的游戏逻辑
 */
class Pvp extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        // 使用固定基准尺寸
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // 创建两个玩家，不同颜色和位置
        this.player1 = new Player(1, 'red', 'left');
        this.player2 = new Player(2, 'blue', 'right');
        
        // 篮子的基本配置
        const basketWidth = 80;
        const basketHeight = 100;
        const basketMargin = 20;  // 与边界的距离
        
        // 创建两个篮子，分别位于左下角和右下角，保持对称
        this.basket1 = new Basket(basketMargin); // 左下角篮子
        this.basket2 = new Basket(this.baseWidth - basketWidth - basketMargin); // 右下角篮子
        
        // 设置篮子尺寸和位置，确保对称
        this.basket1.size = { x: basketWidth, y: basketHeight };
        this.basket2.size = { x: basketWidth, y: basketHeight };
        this.basket1.position = { 
            x: basketMargin, 
            y: this.baseHeight - basketHeight - basketMargin 
        };
        this.basket2.position = { 
            x: this.baseWidth - basketWidth - basketMargin, 
            y: this.baseHeight - basketHeight - basketMargin 
        };
        
        // 为玩家分配篮子
        this.player1.basket = this.basket1;
        this.player2.basket = this.basket2;
        
        // 创建两个独立的游戏统计数据
        this.stats1 = new GameStats(level);
        this.stats2 = new GameStats(level);
        
        // 覆盖目标分数，设置为无限（用一个极大的值表示）
        this.stats1.targetScores = Infinity;
        this.stats2.targetScores = Infinity;
        
        // 设置固定的游戏时间（秒）
        this.gameTime = 15; // 缩短为15秒
        this.stats1.timeLeft = this.gameTime;
        this.stats2.timeLeft = this.gameTime;
        
        this.grass1 = []; // 左侧草块
        this.grass2 = []; // 右侧草块
        this.grassDropInterval = null; // 草块下落计时器
        this.timerInterval = null; // 关卡计时器
        
        // 设置全局的更新分数函数，供Player类使用
        const self = this;
        window.updateScore = function(points, playerId) {
            if (playerId === 1) {
                self.stats1.addScore(points);
            } else if (playerId === 2) {
                self.stats2.addScore(points);
            }
        };
        
        // 玩家控制
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
        
        // 设置玩家活动限制区域
        this.player1Bounds = {
            left: 0,
            right: this.baseWidth / 2 - 10 // 左侧边界
        };
        
        this.player2Bounds = {
            left: this.baseWidth / 2 + 10, // 右侧边界
            right: this.baseWidth
        };
    }
    
    // 游戏对象渲染
    display() {
        background(200);
        
        // 显示游戏统计数据（时间和分数）
        this.displayStats();
        
        // 绘制中央分隔线（修改为完全避开时间显示区域）
        stroke(0);
        strokeWeight(2);
        
        // 在时间下方开始绘制分界线，避开时间显示区域
        line(this.baseWidth / 2, 60, this.baseWidth / 2, this.baseHeight);
        
        noStroke();
        
        // 更新玩家移动（受限制）
        this.movePlayersWithinBounds();
        
        // 绘制玩家
        this.player1.drawPlayer();
        this.player2.drawPlayer();
        
        // 显示篮子
        this.basket1.show();
        this.basket2.show();
        
        // 更新草块
        this.updateGrass();
    }
    
    // 在有边界限制的情况下更新玩家位置
    movePlayersWithinBounds() {
        // 更新玩家1（左侧）
        if (!this.player1.isPaused) {
            this.player1.updateAcceleration();
            this.player1.updateVelocity();
            
            let newX = this.player1.x + this.player1.velocity;
            newX = constrain(newX, this.player1Bounds.left, this.player1Bounds.right - this.player1.w);
            
            let dx = newX - this.player1.x;
            this.player1.x = newX;
            this.player1.updateStack(dx);
        } else {
            this.player1.updateBlinkState();
        }
        
        // 更新玩家2（右侧）
        if (!this.player2.isPaused) {
            this.player2.updateAcceleration();
            this.player2.updateVelocity();
            
            let newX = this.player2.x + this.player2.velocity;
            newX = constrain(newX, this.player2Bounds.left, this.player2Bounds.right - this.player2.w);
            
            let dx = newX - this.player2.x;
            this.player2.x = newX;
            this.player2.updateStack(dx);
        } else {
            this.player2.updateBlinkState();
        }
    }
    
    startGame() {
        this.resetPositions();
        this.setupUpdateScoreFunction();
        this.startGrassDrop();
        this.startLevelTimer();
    }
    
    setupUpdateScoreFunction() {
        const self = this;
        window.updateScore = function(points, playerId) {
            if (playerId === 1) {
                self.stats1.addScore(points);
            } else if (playerId === 2) {
                self.stats2.addScore(points);
            }
        };
    }
    
    startGrassDrop() {
        // 清理现有的定时器
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        
        this.grass1 = [];
        this.grass2 = [];
        
        // 中央分割线位置
        const centerLine = this.baseWidth / 2;
        
        // 设置短暂延迟生成第一个草块
        setTimeout(() => {
            // 左侧区域随机生成草块
            let leftPosition = random(50, centerLine - 60);
            
            // 右侧区域随机生成草块
            let rightPosition = random(centerLine + 60, this.baseWidth - 50);
            
            this.grass1.push(new Grass(leftPosition, 10));
            this.grass2.push(new Grass(rightPosition, 10));
            
            // 设置草块生成间隔，保证两边同步掉落
            this.grassDropInterval = setInterval(() => {
                // 左侧区域随机生成草块
                let leftPosition = random(50, centerLine - 60);
                
                // 右侧区域随机生成草块
                let rightPosition = random(centerLine + 60, this.baseWidth - 50);
                
                this.grass1.push(new Grass(leftPosition, 10));
                this.grass2.push(new Grass(rightPosition, 10));
            }, this.stats1.grassDropDelay);
        }, 1000); // 第一个草块在1秒后出现
    }
    
    // 更新草块
    updateGrass() {
        // 更新左侧草块
        for (let i = this.grass1.length - 1; i >= 0; i--) {
            let grass = this.grass1[i];
            grass.show();
            grass.fall();
            
            if (grass.y > this.baseHeight) { 
                // 草块落地，触发玩家惩罚效果
                this.player1.loseLife(false);
                this.stats1.loseLife();
                this.grass1.splice(i, 1);
                
                // 不再检查生命值，游戏继续进行
            } else if (this.player1.catchGrass(grass)) {
                // 玩家1接住草块
                if (this.player1.stack.length >= this.player1.maxStack) {
                    // 堆栈超过限制，触发玩家惩罚效果
                    this.player1.loseLife(true);
                    this.stats1.loseLife();
                    
                    // 不再检查生命值，游戏继续进行
                }
                this.grass1.splice(i, 1);
            }
        }
        
        // 更新右侧草块
        for (let i = this.grass2.length - 1; i >= 0; i--) {
            let grass = this.grass2[i];
            grass.show();
            grass.fall();
            
            if (grass.y > this.baseHeight) { 
                // 草块落地，触发玩家惩罚效果
                this.player2.loseLife(false);
                this.stats2.loseLife();
                this.grass2.splice(i, 1);
                
                // 不再检查生命值，游戏继续进行
            } else if (this.player2.catchGrass(grass)) {
                // 玩家2接住草块
                if (this.player2.stack.length >= this.player2.maxStack) {
                    // 堆栈超过限制，触发玩家惩罚效果
                    this.player2.loseLife(true);
                    this.stats2.loseLife();
                    
                    // 不再检查生命值，游戏继续进行
                }
                this.grass2.splice(i, 1);
            }
        }
    }
    
    keyPressed() {
        // 玩家1控制 (AD + SPACE)
        if (keyCode === this.controls.player1.left) {
            this.player1.dir = -1;
        } else if (keyCode === this.controls.player1.right) {
            this.player1.dir = 1;
        } else if (keyCode === this.controls.player1.drop) {
            this.player1.dropGrass(); // 空格键触发Player 1的dropGrass
        }
        
        // 玩家2控制 (箭头键 + ENTER)
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
        // 玩家1控制
        if (keyCode === this.controls.player1.left && this.player1.dir === -1) {
            this.player1.dir = 0;
        } else if (keyCode === this.controls.player1.right && this.player1.dir === 1) {
            this.player1.dir = 0;
        }
        
        // 玩家2控制
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
        
        // 每秒更新计时器
        this.timerInterval = setInterval(() => {
            this.stats1.decrementTime();
            this.stats2.decrementTime();
            
            // 仅在时间结束时结束游戏
            if (this.stats1.timeLeft <= 0) {
                // 清理定时器（与Coop逻辑保持一致）
                clearInterval(this.grassDropInterval);
                clearInterval(this.timerInterval);
                
                // 游戏结束，显示结果
                this.showPvpResult();
            }
        }, 1000);
    }
    
    checkGameEnd() {
        // 清理定时器
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.showPvpResult();
    }
    
    showPvpResult() {
        // 获取pvpResultScreen并更新分数
        const pvpResultScreen = this.screenManager.pvpResultScreen;
        pvpResultScreen.update(this.stats1.score, this.stats2.score);
        
        // 切换到结果屏幕
        this.screenManager.changeScreen(pvpResultScreen);
    }
    
    emptyGrass(points, playerId) {
        if (playerId === 1) {
            this.stats1.addScore(points);
            this.player1.stack = [];  // 清空玩家1的草堆
            this.player1.baseMaxSpeed = 15;
            this.player1.baseAcceleration = 1.8;
        } else if (playerId === 2) {
            this.stats2.addScore(points);
            this.player2.stack = [];  // 清空玩家2的草堆
            this.player2.baseMaxSpeed = 15;
            this.player2.baseAcceleration = 1.8;
        }
    }
    
    displayStats() {
        // 中间显示倒计时
        textSize(30);
        textAlign(CENTER);
        fill(0);
        text(`${this.stats1.timeLeft}`, this.baseWidth / 2, 30);
        
        // 左侧玩家分数
        textSize(24);
        textAlign(LEFT);
        fill('red');
        text(`Score: ${this.stats1.score}`, 30, 30);
        
        // 右侧玩家分数
        textAlign(RIGHT);
        fill('blue');
        text(`Score: ${this.stats2.score}`, this.baseWidth - 30, 30);
    }
    
    
    resetPositions() {
        // 重置玩家位置
        this.player1.resetPosition();
        this.player2.resetPosition();
        
        // 确保玩家1只能在左半边移动
        if (this.player1.x > this.player1Bounds.right - this.player1.w) {
            this.player1.x = this.player1Bounds.right - this.player1.w;
        }
        
        // 确保玩家2只能在右半边移动
        if (this.player2.x < this.player2Bounds.left) {
            this.player2.x = this.player2Bounds.left;
        }
    }
    
    startNewGame() {
        // 重置游戏状态
        this.stats1.resetToFirstLevel();
        this.stats2.resetToFirstLevel();
        
        // 重新设置游戏时间
        this.stats1.timeLeft = this.gameTime;
        this.stats2.timeLeft = this.gameTime;
        
        // 清空分数
        this.stats1.score = 0;
        this.stats2.score = 0;
        
        // 重置玩家位置
        this.resetPositions();
        
        // 清空草块
        this.grass1 = [];
        this.grass2 = [];
        
        // 清理定时器
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // 确保更新分数函数被正确设置
        this.setupUpdateScoreFunction();
        
        // 开始新游戏
        this.startGrassDrop();
        this.startLevelTimer();
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
        for (let grass of this.grass1) {
            grass.pause();
        }
        for (let grass of this.grass2) {
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
            // 中央分割线位置
            const centerLine = this.baseWidth / 2;
            
            // 只创建生成草的定时器，不清空现有的草
            this.grassDropInterval = setInterval(() => {
                // 左侧区域随机生成草块
                let leftPosition = random(50, centerLine - 60);
                
                // 右侧区域随机生成草块
                let rightPosition = random(centerLine + 60, this.baseWidth - 50);
                
                this.grass1.push(new Grass(leftPosition, 10));
                this.grass2.push(new Grass(rightPosition, 10));
            }, this.stats1.grassDropDelay);
        }
        
        if (!this.timerInterval) {
            this.startLevelTimer();
        }
        
        // 恢复所有草的下落
        for (let grass of this.grass1) {
            grass.resume();
        }
        for (let grass of this.grass2) {
            grass.resume();
        }
    }
    
    // 重置游戏（用于从暂停菜单重新开始）
    reset() {
        // 重置游戏状态
        this.stats1.reset();
        this.stats2.reset();
        
        // 重新设置游戏时间
        this.stats1.timeLeft = this.gameTime;
        this.stats2.timeLeft = this.gameTime;
        
        // 清空分数
        this.stats1.score = 0;
        this.stats2.score = 0;
        
        // 清理计时器
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 重置玩家和草
        this.grass1 = [];
        this.grass2 = [];
        this.resetPositions();
        this.player1.stack = [];
        this.player2.stack = [];
        
        // 注意：reset后需要单独调用startGame
    }
}
