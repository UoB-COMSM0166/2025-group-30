class Pvp extends Screen { // player with higher score in the set time wins
    constructor(screenManager, level=1, timer=30, grassDropDelay=1500) {
        // --- basic settings ---
        super(screenManager);
        this.backgroundImage = loadImage("assets/barn.webp");

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.pvpLevelUpScreen = new PvpLevelUpScreen(this.screenManager,this);

        this.player1 = new Player("pvpLeft");
        this.basket1 = new Basket("left");
        this.player1.basket = this.basket1;
        this.grass1 = []; //collection of falling grass
        
        this.player2 = new Player("pvpRight");
        this.basket2 = new Basket("right");
        this.player2.basket = this.basket2;
        this.grass2 = []; //collection of falling grass
        
        // --- level related settings ---
        this.level = level;
        this.timer = timer;       
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.timeLeft= timer;
        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second

    }

    display(){ 
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket1.draw(); 
        this.basket2.draw(); 

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

    startGrassDropAndLevelTimer() { //
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        
        this.grass1 = []; //empty the grass piles
        this.grass2 = [];

        // 设置一个较短的延迟来生成第一个草块
        setTimeout(() => {
            // 为玩家1生成草堆
            this.grass1.push(new Grass(random(200, baseWidth/2 - 100), 10));
            // 为玩家2生成草堆
            this.grass2.push(new Grass(random(baseWidth/2, baseWidth-100), 10));

            // 然后开始正常的草块生成间隔
            this.grassDropInterval = setInterval(() => {
                if (this.screenManager.currentScreen === this) {
                    // 按照固定频率生成草堆
                    if (this.player1.flash.getFlashDuration() === 0) {
                        this.grass1.push(new Grass(random(200, baseWidth/2 - 100), 10));
                        console.log("start grass drop 1");
                    }
                    if (this.player2.flash.getFlashDuration() === 0) {
                        this.grass2.push(new Grass(random(baseWidth/2, baseWidth-100), 10));
                        console.log("start grass drop 2");
                    }
                }         
            }, this.grassDropDelay);
        }, 1000);
         
        this.startLevelTimer();  
    }

    stopGrassDropAndLevelTimer() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
            console.log("stop grass drop for 1 and 2");
        }
        this.stopLevelTimer();
    }

    // --- main game logic ----
    updateFallingGrass() { //update the grass from this.grass based on if caught or missed   
        this.updateGrass1();
        this.updateGrass2();
    }

    updateGrass1() { //update the grass from this.grass1 based on if caught or missed   
        for (let i = this.grass1.length - 1; i >= 0; i--) {
            if (this.player1.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) this.grass1[i].fall(); //stop grass fall if flashing is on or game is paused           
            
            if (this.grass1[i].y > baseHeight|| this.player1.checkGrassCaught(this.grass1[i])) {
                this.grass1.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    updateGrass2() { //update the grass from this.grass2 based on if caught or missed   
        for (let i = this.grass2.length - 1; i >= 0; i--) {
            if (this.player2.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) this.grass2[i].fall(); //stop grass fall if flashing is on or game is paused           
            
            if (this.grass2[i].y > baseHeight|| this.player2.checkGrassCaught(this.grass2[i])) {
                this.grass2.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }
    
    drawGrass(){ //draw the grass
        for (let i = this.grass1.length - 1; i >= 0; i--) this.grass1[i].draw();
        for (let i = this.grass2.length - 1; i >= 0; i--) this.grass2[i].draw();
    }

    startLevelTimer() { 
        console.log("start level timer for player 1 and 2");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) { 
                if (this.screenManager.currentScreen === this) this.timeLeft--; //time goes down for both player even if one player is flashing
            }
            else { //check when times run out
                this.stopGrassDropAndLevelTimer();
                this.screenManager.changeScreen(this.pvpLevelUpScreen);
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
    }

    resetToLevel1(){ //reset to level 1
        this.level = 1;
        this.timer = 30;
        this.grassDropDelay = 1500; // 初始频率从2000ms改为1500ms

        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { //restart from the current level
        this.clearStats();
        // 清空草堆数组
        this.grass1 = [];
        this.grass2 = [];
        // 重新开始草堆生成和计时器
        this.startGrassDropAndLevelTimer();
    }

    displayUI() {
        // 更新两个篮子的分数，只显示当前得分
        this.basket1.updateScore(this.player1.score, 0);
        this.basket2.updateScore(this.player2.score, 0);

        stroke(0);
        line(baseWidth/ 2, 0, baseWidth/ 2, baseHeight);
        noStroke();

        fill(255);
        textSize(20);
        stroke(0);
        strokeWeight(2);
        textStyle(BOLD);
        
        textAlign(CENTER);
        text(`Level ${this.level}`, baseWidth / 2, 30);
        
        textAlign(LEFT);
        text(`Time: ${this.timeLeft}s`, 20, 30);
        noStroke();
        textStyle(NORMAL);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.timer += 30;
        this.grassDropDelay = max(500, this.grassDropDelay-300); // 每关减少300ms，而不是500ms

        this.restartFromCurrentLevel();
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