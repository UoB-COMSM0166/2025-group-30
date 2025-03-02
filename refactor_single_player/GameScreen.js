class GameScreen extends Screen {
    constructor(screenManager) {
        // --- basic settings ---
        super(screenManager);

        this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.paused = false;
    }

    display(){ 
        background(200); 
        this.basket.show(); 

        this.player.move(); 
        this.player.show(); //show player with grass
        
        this.updateGrass();
        this.displayUI();      
    }

    // --- initialising the game state ---
    startGrassDrop() {
        if (!this.screenManager.currenScreen === this){return;}
        
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval);}

        this.grass = []; //empty the grass piles

        //grass drops start immediately 
        this.grass.push(new Grass(random(200, width - 100), 10));

        this.grassDropInterval = setInterval(() => {
            if (this.player.flash.flashDuration === 0 && !this.paused){ //grass drop continue if flashing is not on && game is not paused
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
        }
    }
    

    // --- main game logic ----
    updateGrass() { //update the grass from this.grass if caught or missed
        
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].show();
            if (this.player.flash.flashDuration === 0 && !this.paused) this.grass[i].fall(); //stop grass fall if flashing is on or game is paused

            if (this.grass[i].y > height) { //if miss a grass, lives--, player flashes
                this.player.lives--;
                this.player.flash.flashDuration = 60;

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

    startLevelTimer() {
        console.log("start level timer");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                if (this.player.flash.flashDuration === 0 && !this.paused) this.timeLeft--; //stop the timer if flashing is on or game is paused
            }
            else { //check when times run out
                if (this.player.score >= this.targetScores){ //move up a level
                    this.stopGrassDrop();
                    this.screenManager.changeScreen(this.levelSuccessScreen);
                } 
                else { //game over
                    this.stopGrassDrop();
                    this.screenManager.changeScreen(this.gameOverScreen);
                };
            }
        }, 1000);
    }

    clearStats(){
        this.player.reset();
        this.timeLeft = this.timer;
        this.paused = false;
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
        let heartX = 20;
        let heartY = 120;
        for (let i = 0; i < 3; i++) {
            fill(i < this.player.lives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY,20);
        }
    }

    displayUI() {
        this.displayLives();

        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Level ${this.level}`, width / 2, 30);
        text(`Score: ${this.player.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.player.emptyGrass(); //spacebar    
        else if (keyCode === ESCAPE) {
            this.paused = true;
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }

    

    // -- level up mechanism --//
    
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.targetScores+= 5;
        this.timer += 10;
        this.grassDropDelay = max(500, this.grassDropDelay-500);

        this.restart();
    }

}