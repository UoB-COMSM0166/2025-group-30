class Single extends Screen {
    constructor(screenManager, level=1, targetScores=5, timer=20, grassDropDelay=2000) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);

        this.player = new Player("middle");
        this.basket = new Basket("left");
        this.player.basket = this.basket;

        // --- level related settings ---
        this.level = level;
        this.targetScores = targetScores;
        this.timer = timer;
        this.timeLeft = timer;
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.grass = []; //collection of falling grass
        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second
    }

    display(){ 
        background(200); 
        this.basket.draw(); 

        if (this.screenManager.currentScreen === this){
            this.player.movePlayerWithCaughtGrass();   
            this.updateFallingGrass();     
        }
        this.drawFallingGrass();
        this.player.drawPlayerWithCaughtGrass(); //show player with grass   
        
        this.displayUI();      
    }

    // --- initialising the game state ---
    startGrassDropAndLevelTimer() {
        console.log("Single: 开始草堆掉落和关卡计时器");
        
        // 如果已经有草堆计时器在运行，先清除它并设为null
        if (this.grassDropInterval) {
            console.log("Single: 清除已存在的草堆计时器");
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }

        this.grass = []; //empty the grass piles

        // 设置一个较短的延迟来生成第一个草块
        setTimeout(() => {
            // 确保此时没有其他计时器在运行
            if (this.grassDropInterval === null) {
                // 生成第一个草块
                let firstX = random(200, baseWidth - 100);
                this.grass.push(new Grass(firstX, 10));
                console.log("Single: 第一个草堆生成在位置 x=" + firstX);

                // 创建新的草堆生成计时器
                this.grassDropInterval = setInterval(() => {
                    // 只有当玩家不在闪烁状态且游戏没有暂停时才生成新的草堆
                    if (this.player.flash.getFlashDuration() === 0 
                        && this.screenManager.currentScreen === this) { 
                        let newX = random(200, baseWidth - 100);
                        this.grass.push(new Grass(newX, 10));
                        console.log("Single: 新草堆生成在位置 x=" + newX);
                    } 
                }, this.grassDropDelay);
                console.log("Single: 草堆生成间隔设置为 " + this.grassDropDelay + "ms");
            } else {
                console.log("Single: 已有草堆计时器在运行，跳过创建");
            }
        }, 1000);

        this.startLevelTimer();    
    }


    stopGrassDropAndLevelTimer() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
            console.log("stop grass drop");
        }
        this.stopLevelTimer();
    }
    

    // --- main game logic ----
    updateFallingGrass() { //update the grass from this.grass based on if caught or missed   
        for (let i = this.grass.length - 1; i >= 0; i--) {
            if (this.player.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) {
                this.grass[i].fall();
            } //stop grass fall if flashing is on or game is paused            
            
            if (this.grass[i].y > baseHeight || this.player.checkGrassCaught(this.grass[i])) {
                this.grass.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }
    
    drawFallingGrass(){ //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].draw();}
    }

    startLevelTimer() {
        console.log("start level timer");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                if (this.player.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) this.timeLeft--;
            }
            else { //check when times run out
                this.stopGrassDropAndLevelTimer();
                if (this.player.score >= this.targetScores) this.screenManager.changeScreen(this.levelSuccessScreen); //move up a level    
                else this.screenManager.changeScreen(this.gameOverScreen); //game over
            }
        }, 1000);
    }

    stopLevelTimer() {      
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
            this.levelTimerInterval = null;
        }
        console.log("stop level timer");
    }

    clearStats(){
        // 重置玩家状态
        this.player.reset();
        // 重置时间
        this.timeLeft = this.timer;
        // 停止所有计时器和草块生成
        this.stopGrassDropAndLevelTimer();
        // 清空草块数组
        this.grass = [];
    }

    resetToLevel1(){ //reset to level 1
        this.level = 1;
        this.targetScores = 5;
        this.timer = 20;
        this.grassDropDelay = 2000;

        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { // restart from the current level
        console.log("Single: 从当前关卡重新开始");
        
        // 清除统计信息和所有计时器
        this.clearStats();
        
        // 直接启动新的计时器，因为clearStats已经调用了stopGrassDropAndLevelTimer
        console.log("Single: 重新启动草堆掉落");
        this.startGrassDropAndLevelTimer();
    }

    displayUI() {
        // 更新篮子的分数
        this.basket.updateScore(this.player.score, this.targetScores);

        fill(0);
        textSize(20);

        textAlign(CENTER);
        text(`Level ${this.level}`, baseWidth/ 2, 30);
        
        textAlign(LEFT);
        text(`Time: ${this.timeLeft}s`, 20, 30);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        // 更新游戏状态
        this.level++;
        this.targetScores += 20;
        this.timer += 30;
        this.grassDropDelay = max(500, this.grassDropDelay-1000);
        
        // 重置游戏状态
        this.clearStats();
        
        // 切换到目标分数屏幕
        this.screenManager.changeScreen(this.targetScoreScreen);
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.player.emptyToBasket(); //spacebar    
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }
}