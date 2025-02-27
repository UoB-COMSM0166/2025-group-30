class Single extends Screen {
    constructor(screenManager, level=1, targetScores=5, timer=10, grassDropDelay=2000) {
        super(screenManager);

        this.player = new Player();
        this.basket = new Basket();

        this.level = level;
        this.targetScores = targetScores;
        this.timer = timer;
        this.timeLeft = timer;
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.score = 0;
        this.grass = []; //collection of falling grass
        this.grassDropInterval = null;
        this.timerInterval = null;

        this.startGrassDrop(); //start dropping grass immediately 
        this.startLevelTimer(); //start the level timer

        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this.level, this.score, this.targetScores);
        this.gameOverScreen = new GameOverScreen(this.screenManager,this.level, this.score, this.targetScores);
    }

    display(){   
        background(200);    
        this.player.move();        
        this.player.update();
        this.basket.show();

        this.updateGrass();

        this.displayLives();
        this.displayUI();
    }

    startGrassDrop() {
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval);}

        this.grass = []; //empty the grass piles

        this.grassDropInterval = setInterval(() => {
            this.grass.push(new Grass(random(200, width - 100), 10));            
        }, this.grassDropDelay); //grass falls every 2 seconds     
    }

    // stopGrassDrop() {
    //     if (this.grassDropInterval) {
    //         clearInterval(this.grassDropInterval);
    //         this.grassDropInterval = null;
    //     }
    // }

    

    updateGrass() { //update the grass from this.grass if caught or missed
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].show();
            this.grass[i].fall();

            if (this.grass[i].y > height) { //if miss a grass, lives--
                this.player.lives--;
                if (this.player.lives <= 0) { //check for game over
                    this.reset();
                    this.gameOverScreen.update(this.level, this.score, this.targetScores);
                    this.screenManager.changeScreen(this.gameOverScreen);
                };
            }              
            
            if (this.grass[i].y > height || this.player.catchGrass(this.grass[i])) {
                this.grass.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    emptyGrass() { //empty grass to the basket
        if (this.player.x <= this.basket.x + this.basket.w) {
            this.score += this.player.stack.length;
            this.player.stack = [];
            this.player.maxSpeed = 10;
            this.player.acceleration = 2;
        }
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
        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Level ${this.level}`, width / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timeLeft}s`, 20, 90);
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.emptyGrass(); //spacebar      
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }

    reset(){
        this.timeLeft = this.timer;
        this.player.lives =3;
        this.score = 0;
        this.grass = [];
    }

    // -- level up mechanism --//
    startLevelTimer() {
        if (this.timerInterval) {clearInterval(this.timerInterval);}

        //this.timer = timer; //reset the timer at the start of a level
        this.timerInterval = setInterval(() => {
            if (this.timeLeft >0) {
                this.timeLeft--;
            }
            else { //check when times run out
                if (this.score >= this.targetScores){ //move up a level
                    this.reset();
                    this.levelSuccessScreen.update(this.level, this.score, this.targetScores);
                    this.screenManager.changeScreen(this.levelSuccessScreen);
                } 
                else { //game over
                    this.reset();
                    this.gameOverScreen.update(this.level, this.score, this.targetScores);
                    this.screenManager.changeScreen(this.gameOverScreen);
                };
            }
        }, 1000);
    }

    // --- show level success screen --
    showLevelSuccess() {
        // Update the LevelSuccessScreen content dynamically
        this.levelSuccessScreen.update(this.level, this.score, this.targetScores);
        this.screenManager.changeScreen(this.levelSuccessScreen);
    }
    
    //--- Move to next level ---
    levelUp() { 
        this.level++;
        this.targetScores = 50;
        this.timer = 60;
        this.timeLeft = 60;
        this.grassDropDelay = 1500;
        this.score = 0;

        // Restart the grass drop and timer for the new level
        this.startGrassDrop();
        this.startLevelTimer();
    }
}