class Coop extends Screen {
    constructor(screenManager, level=1, targetScores=5, timer=20, grassDropDelay=2000) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);

        this.player1 = new Player("left");
        this.player2 = new Player("right");
        this.basket = new Basket("left"); // 只使用一个篮子
        this.player1.basket = this.basket;
        this.player2.basket = this.basket;
        
        this.grass1 = []; //collection of falling grass
        this.grass2 = []; //collection of falling grass
        
        // --- level related settings ---
        this.level = level;
        this.targetScores = targetScores;
        this.timer = timer;       
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.timeLeft= timer;
        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second
    }

    display(){ 
        background(200); 
        this.basket.draw(); // 只绘制一个篮子

        if (this.screenManager.currentScreen === this){
            this.player1.movePlayerWithCaughtGrass();  
            this.player2.movePlayerWithCaughtGrass();   
            this.updateFallingGrass();     
        }

        this.drawGrass();
        this.player1.drawPlayerWithCaughtGrass(); //show player with grass 
        this.player2.drawPlayerWithCaughtGrass();  
    
        this.displayUI();      
    }

    // --- initialising the game state ---

    startGrassDropAndLevelTimer() {
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
  
        this.grass1 = []; //empty the grass piles
        this.grass2 = []; //empty the grass piles

        // 设置一个较短的延迟来生成第一个草块
        setTimeout(() => {
            // 在全屏范围内随机生成草堆
            this.grass1.push(new Grass(random(200, baseWidth - 100), 10));
            
            // 然后开始正常的草块生成间隔
            this.grassDropInterval = setInterval(() => {
                if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0) && this.screenManager.currentScreen === this){ //grass drop continue if flashing for both player is not on && game is not paused
                    // 在全屏范围内随机生成草堆
                    this.grass1.push(new Grass(random(200, baseWidth - 100), 10));
                    console.log("start grass drop");
                }           
            }, this.grassDropDelay); //grass falls every 2 seconds          
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

    updateFallingGrass() { //update the grass from this.grass1 based on if caught or missed   
        for (let i = this.grass1.length - 1; i >= 0; i--) {
            if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0) && this.screenManager.currentScreen === this) {
                this.grass1[i].fall();
            } //stop grass fall if flashing is on or game is paused

            if (this.player1.checkGrassCaught(this.grass1[i]) || this.player2.checkGrassCaught(this.grass1[i]) || this.grass1[i].y > baseHeight) {
                this.grass1.splice(i, 1);
            }
        }
    }

    drawGrass(){ //draw the grass
        for (let i = 0; i < this.grass1.length; i++){
            this.grass1[i].draw();
        }
    }

    startLevelTimer() { 
        console.log("start level timer for player 1 and 2");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) { 
                if (this.screenManager.currentScreen === this) this.timeLeft--; //time goes down for both player during flashing
            }
            else { //check when times run out
                this.stopGrassDropAndLevelTimer();
                if ((this.player1.score + this.player2.score) >= this.targetScores) this.screenManager.changeScreen(this.levelSuccessScreen); //move up a level    
                else this.screenManager.changeScreen(this.gameOverScreen); //game over
            }
        }, 1000);
    }

    stopLevelTimer() {      
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
            this.levelTimerInterval = null;
        }
        console.log("stop level timer for 1 and 2");
    }

    clearStats(){
        this.player1.reset();
        this.player2.reset();
        this.timeLeft = this.timer;
        this.stopGrassDropAndLevelTimer();
        this.grass1 = [];
        this.grass2 = [];
    }

    resetToLevel1(){ //reset to level 1
        this.level = 1;
        this.timer = 15;
        this.targetScores = 5;
        this.grassDropDelay = 1000; // 加快初始生成频率

        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { //restart from the current level
        this.clearStats();
        this.screenManager.changeScreen(this.targetScoreScreen);
        this.startGrassDropAndLevelTimer(); 
    }

    displayUI() {
        // 更新篮子的分数
        this.basket.updateScore(this.player1.score + this.player2.score, this.targetScores);

        fill(0);
        textSize(20);
        
        textAlign(CENTER);
        text(`Level ${this.level}`, baseWidth / 2, 30);
        
        textAlign(LEFT);
        text(`Time: ${this.timeLeft}s`, 20, 30);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.targetScores += 5;
        this.timer += 15;
        this.grassDropDelay = max(500, this.grassDropDelay-200); // 加快生成频率的减少速度
        
        this.clearStats();
        
        this.screenManager.changeScreen(this.targetScoreScreen);
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player2.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player2.dir = -1;
        else if (keyCode === ENTER) this.player2.emptyToBasket();

        else if (keyCode === 68) this.player1.dir = 1; // D
        else if (keyCode === 65) this.player1.dir = -1; // A
        else if (keyCode === 32) this.player1.emptyToBasket(); //spacebar    
        
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === 68 || keyCode === 65) this.player1.dir = 0;
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player2.dir = 0;
    }
}