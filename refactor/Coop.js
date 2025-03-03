class Coop extends Screen {
    constructor(screenManager, level=1, targetScores=5, timer=15, grassDropDelay = 1500) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);

        this.basket = new Basket("left");  
        this.grass = []; //collection of falling grass 
        
        this.player1 = new Player("left"); //player 1 lives represent the overall shared lives
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
        this.basket.show(); 

        if (this.screenManager.currentScreen === this){
            this.player1.move();  
            this.player2.move();   
            this.updateGrass();     
        }

        this.player1.show(); //show player with grass 
        this.player2.show();  
        this.showGrass();

        this.displayUI();      
    }

    // --- initialising the game state ---

    startGrassDrop() { //
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
  
        this.grass = []; //empty the grass piles

        //grass drops start immediately 
        this.grass.push(new Grass(random(200, width - 100), 10));
    
        this.grassDropInterval = setInterval(() => {
            if ((this.player1.flash.flashDuration === 0 || this.player2.flash.flashDuration === 0) && this.screenManager.currentScreen === this){ //grass drop continue if flashing for both player is not on && game is not paused
                this.grass.push(new Grass(random(200, width - 100), 10));
                console.log("start grass drop");
            }           
        }, this.grassDropDelay); //grass falls every 1.5 seconds          
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

    updateGrass() { //update the grass from this.grass1 based on if caught or missed   
        for (let i = this.grass.length - 1; i >= 0; i--) {
            if ((this.player1.flash.flashDuration === 0 || this.player2.flash.flashDuration === 0) && this.screenManager.currentScreen === this) {
                this.grass[i].fall();
            } //stop grass fall if flashing is on or game is paused
            
            if (this.grass[i].y > height) { //if miss a grass, both playes flash
                this.player1.lives--;

                this.player1.flash.flashDuration = 30;
                this.player2.flash.flashDuration = 30;

                if (this.player1.lives <= 0) { //check for game over
                    this.stopGrassDrop();
                    this.screenManager.changeScreen(this.gameOverScreen);
                };
            }   

            if (this.player1.catchGrass(this.grass[i])) this.grass.splice(i, 1); // check if player 1 catches the grass first
            else if (this.player2.catchGrass(this.grass[i])) this.grass.splice(i, 1); //then player 2
            else if (this.grass[i].y > height) this.grass.splice(i, 1);  // Remove if off-screen or caught
        }
    }

    showGrass(){ //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--){
            this.grass[i].show();
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
                this.stopGrassDrop();
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
        this.stopGrassDrop();     
    }

    reset(){ //reset to level 1
        this.level = 1;
        this.timer = 15;
        this.targetScores = 5;
        this.grassDropDelay = 1500;

        this.restart();
    }

    restart() { //restart from the current level
        this.clearStats();
        this.startGrassDrop();
    }

    displayLives() {
        for (let i = 0; i < 3; i++) {
            fill(i < this.player1.lives ? 'red' : 'gray');
            circle(30 + i * 30, 120, 20);
        }
    }

    displayUI() {
        this.displayLives();

        fill(0);
        textSize(20);
        
        textAlign(CENTER);
        text(`Level ${this.level}`, width / 2, 30);
        
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

        this.restart();
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player2.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player2.dir = -1;
        else if (keyCode === ENTER) this.player2.emptyGrass();

        else if (keyCode === 68) this.player1.dir = 1; // D
        else if (keyCode === 65) this.player1.dir = -1; // A
        else if (keyCode === 32) this.player1.emptyGrass(); //spacebar    
        
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === 68 || keyCode === 65) this.player1.dir = 0;
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player2.dir = 0;
    }
}