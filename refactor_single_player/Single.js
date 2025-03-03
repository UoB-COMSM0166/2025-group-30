class Single extends Screen {
    constructor(screenManager, level=1, targetScores=3, timer=10, grassDropDelay=2000) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);

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
        this.basket.show(); 

        if (this.screenManager.currentScreen === this){
            this.player.move();   
            this.updateGrass();     
        }

        this.player.show(); //show player with grass   
        this.showGrass();

        this.displayUI();      
    }

    // --- initialising the game state ---
    startGrassDrop() {
        //if (!this.screenManager.currentScreen === this) return;
        
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval);}

        this.grass = []; //empty the grass piles

        //grass drops start immediately 
        this.grass.push(new Grass(random(200, width - 100), 10));

        this.grassDropInterval = setInterval(() => {
            if (this.player.flash.flashDuration === 0 && this.screenManager.currentScreen === this){ //grass drop continue if flashing is not on && game is not paused
                this.grass.push(new Grass(random(200, width - 100), 10));
                console.log("start grass drop");
            }            
        }, this.grassDropDelay); //grass falls every 2 seconds 
         
        this.startLevelTimer();    
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
            console.log("stop grass drop");
        }
        this.stopLevelTimer();
    }
    

    // --- main game logic ----
    updateGrass() { //update the grass from this.grass based on if caught or missed   
        for (let i = this.grass.length - 1; i >= 0; i--) {
            if (this.player.flash.flashDuration === 0 && this.screenManager.currentScreen === this) {
                this.grass[i].fall();
            } //stop grass fall if flashing is on or game is paused
            
            if (this.grass[i].y > height) { //if miss a grass, lives--, player flashes
                this.player.lives--;
                this.player.flash.flashDuration = 30;

                if (this.player.lives <= 0) { //check for game over
                    this.stopGrassDrop();
                    this.screenManager.changeScreen(this.gameOverScreen);
                };
            }              
            
            if (this.grass[i].y > height || this.player.catchGrass(this.grass[i])) {
                this.grass.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }
    
    showGrass(){ //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].show();}
    }

    startLevelTimer() {
        console.log("start level timer");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                if (this.player.flash.flashDuration === 0 && this.screenManager.currentScreen === this) this.timeLeft--;
            }
            else { //check when times run out
                this.stopGrassDrop();
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
        this.player.reset();
        this.timeLeft = this.timer;
        this.stopGrassDrop();     
    }

    reset(){ //reset to level 1
        this.level = 1;
        this.targetScores = 3;
        this.timer = 10;
        this.grassDropDelay = 2000;

        this.restart();
    }

    restart() { //restart from the current level
        this.clearStats();
        this.startGrassDrop();
    }

    displayLives() {
        for (let i = 0; i < 3; i++) {
            fill(i < this.player.lives ? 'red' : 'gray');
            circle(20 + i * 30, 120, 20);
        }
    }

    displayUI() {
        this.displayLives();

        fill(0);
        textSize(20);

        textAlign(CENTER);
        text(`Level ${this.level}`, width / 2, 30);
        
        textAlign(LEFT);
        text(`Score: ${this.player.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.targetScores+= 5;
        this.timer += 10;
        this.grassDropDelay = max(500, this.grassDropDelay-500);

        this.restart();
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.player.emptyGrass(); //spacebar    
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }
}