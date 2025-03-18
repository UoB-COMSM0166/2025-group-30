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
        this.startGrassDrop();
        this.startLevelTimer();    
    }

    startGrassDrop() {       
        console.log("!!!!!!!!!! start grass drop !!!!!!!!!");
        
        if (this.grassDropInterval) {clearInterval(this.grassDropInterval);}

        // 设置一个较短的延迟来生成第一个草块
        setTimeout(() => {
            if (this.player.flash.getFlashDuration() === 0 
            && this.screenManager.currentScreen === this) {
                this.grass.push(new Grass(random(200, baseWidth - 100), 10));
                console.log("!!!!First Grass!!!!");
            }
        
            // 创建新的草堆生成计时器
            this.grassDropInterval = setInterval(() => {
                // 只有当玩家不在闪烁状态且游戏没有暂停时才生成新的草堆
                if (this.player.flash.getFlashDuration() === 0 
                    && this.screenManager.currentScreen === this) { 
                    this.grass.push(new Grass(random(200, baseWidth - 100), 10));
                } else if (this.player.flash.getFlashDuration() !== 0) {
                    this.stopGrassDrop();
                    this.startGrassDrop();
                }
            }, this.grassDropDelay);
        }, 1000);
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

    stopGrassDropAndLevelTimer() {
        this.stopGrassDrop();
        this.stopLevelTimer();
    }

    stopGrassDropAndLevelTimer() {
        this.stopGrassDrop();
        this.stopLevelTimer();
    }

    stopLevelTimer() {      
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
        }
        console.log("stop level timer");
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
        }
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



    resetStats(){
        // 重置玩家状态
        this.player.reset();
        // 重置时间
        this.timeLeft = this.timer;
        // 停止所有计时器和草块生成
        this.stopGrassDropAndLevelTimer();

        this.grass = [];
    }

    resetToLevel1(){ //reset to level 1
        this.level = 1;
        this.targetScores = 5;
        this.timer = 20;
        this.grassDropDelay = 2000;

        this.resetStats();
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
    setNextLevel() { 
        // 更新游戏状态
        this.level++;
        this.targetScores += 20;
        this.timer += 30;
        this.grassDropDelay = max(500, this.grassDropDelay-1000);
        
        // 重置游戏状态
        this.resetStats();
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