class Coop extends Screen {
    constructor(screenManager, level=1, targetScores=5, timer=15, grassDropDelay = 1500) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);

        this.basket = new Basket("left");  
        this.grass = []; //collection of falling grass 
        
        this.player1 = new Player("left");
        this.player1.basket = this.basket;

        this.player2 = new Player("right");        
        this.player2.basket = this.basket;
        
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
        this.basket.draw(); 

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
  
        this.grass = []; //empty the grass piles

        this.grass.push(new Grass(random(200, baseWidth - 100), 10)); //grass drops start immediately 
        
        this.grassDropInterval = setInterval(() => {
            if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0) && this.screenManager.currentScreen === this){ //grass drop continue if flashing for both player is not on && game is not paused
                this.grass.push(new Grass(random(200, baseWidth - 100), 10));
                console.log("start grass drop");
            }           
        }, this.grassDropDelay); //grass falls every 1.5 seconds          
       

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
        for (let i = this.grass.length - 1; i >= 0; i--) {
            if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0) && this.screenManager.currentScreen === this) {
                this.grass[i].fall();
            } //stop grass fall if flashing is on or game is paused

            if (this.player1.checkGrassCaught(this.grass[i])) {this.grass.splice(i, 1);} // check if player 1 catches the grass first
            else if (this.player2.checkGrassCaught(this.grass[i])) {this.grass.splice(i, 1);} //then player 2
            else if (this.grass[i].y > baseHeight) {this.grass.splice(i, 1);}  // Remove if off-screen or caught
        }
    }

    drawGrass(){ //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--){
            this.grass[i].draw();
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
    }

    resetToLevel1(){ //reset to level 1
        this.level = 1;
        this.timer = 15;
        this.targetScores = 5;
        this.grassDropDelay = 1500;

        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { //restart from the current level
        this.clearStats();
        this.startGrassDropAndLevelTimer();
    }

    displayUI() {

        fill(0);
        textSize(20);
        
        textAlign(CENTER);
        text(`Level ${this.level}`, baseWidth / 2, 30);
        
        textAlign(LEFT);
        text(`Score: ${this.player1.score + this.player2.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.targetScores+= 5;
        this.timer += 15;
        this.grassDropDelay = max(250, this.grassDropDelay-500);

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