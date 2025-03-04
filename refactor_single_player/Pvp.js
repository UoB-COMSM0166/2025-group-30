class Pvp extends Screen {
    constructor(screenManager, level = 1) {
        super(screenManager);
        
        // 使用固定基准尺寸
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // 创建两个玩家，不同颜色和位置
        this.player1 = new Player(1, 'red', 'left');
        this.player2 = new Player(2, 'blue', 'right');
        
        // 设置为PvP模式，启用更长的闪烁惩罚时间
        this.player1.isPvpMode = true;
        this.player2.isPvpMode = true;
        
        // 创建两个篮子，分别位于左下角和右下角
        this.basket1 = new Basket(20); // 左下角篮子
        this.basket2 = new Basket(this.baseWidth - 100); // 右下角篮子
        
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
        
        // 直接使用ScreenManager中的PvpResultScreen
        this.pvpResultScreen = this.screenManager.pvpResultScreen;
        
        // 设置全局的更新分数函数，供Player类使用
        const self = this;
        window.updateScore = function(points, playerId) {
            if (playerId === 1) {
                self.emptyGrass(points, 1);
            } else if (playerId === 2) {
                self.emptyGrass(points, 2);
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
        this.startGrassDrop();
        this.startLevelTimer();
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
                this.checkGameEnd();
            }
        }, 1000);
    }
    
    checkGameEnd() {
        clearInterval(this.grassDropInterval);
        clearInterval(this.timerInterval);
        
        this.showPvpResult();
    }
    
    showPvpResult() {
        // 更新结果屏幕上的分数
        this.pvpResultScreen.update(this.stats1.score, this.stats2.score);
        
        // 切换到结果屏幕
        this.screenManager.changeScreen(this.pvpResultScreen);
    }
    
    emptyGrass(points, playerId) {
        if (playerId === 1) {
            this.stats1.addScore(points);
        } else if (playerId === 2) {
            this.stats2.addScore(points);
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
    
    // 添加鼠标点击处理方法
    mousePressed() {
        // PvP游戏进行中不处理点击事件
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
        
        // 开始新游戏
        this.startGrassDrop();
        this.startLevelTimer();
    }
}
