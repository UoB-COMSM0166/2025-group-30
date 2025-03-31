class Single extends Screen {
    constructor(screenManager, level = 1) {
        // --- basic settings ---
        super(screenManager);
        this.backgroundImage = null;
        this.loadBackgroundImage();

        // --- level related settings ---
        this.level = new Level(Level.GAME_MODES.SINGLE, level);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);

        this.player = new Player("middle");
        this.basket = new Basket("left");
        this.player.basket = this.basket;

        this.grass = []; //collection of falling grass
        this.shovels = [];

        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second        
        this.shovelDropInterval = null;
    }

    display() {
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket.draw();

        if (this.screenManager.currentScreen === this) { //stop updating when paused
            this.player.movePlayerWithCaughtGrass();
            this.updateFallingGrass();
            this.updateShovels();
        }
        this.drawFallingGrass();
        this.drawShovels();
        this.player.drawPlayerWithCaughtGrass(); //show player with grass   

        this.displayUI();
    }

    // --- initialising the game state ---

    startGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }

        this.grass = []; //empty the grass piles

        setTimeout(() => {
            if (this.grassDropInterval === null) {
                let firstX = random(200, baseWidth - 100);
                this.grass.push(new Grass(firstX, 10));

                this.grassDropInterval = setInterval(() => {
                    if (this.player.flash.getFlashDuration() === 0
                        && this.screenManager.currentScreen === this) {
                        let newX = random(200, baseWidth - 100);
                        this.grass.push(new Grass(newX, 10));
                    }
                }, this.level.grassDropDelay);
            }
        }, 1000);
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
    }

    startShovelDrop() {
        if (this.level.level === 1) return; //shovels starts from level 2
        if (this.shovelDropInterval) {
            clearInterval(this.shovelDropInterval);
            this.shovelDropInterval = null;
        }

        this.shovels = []; //empty the shovel piles   

        this.shovelDropInterval = setInterval(() => {
            if (this.player.flash.getFlashDuration() === 0
                && this.screenManager.currentScreen === this) {
                let newX = random(200, baseWidth - 100);
                this.shovels.push(new Shovel(newX, 10));
            }
        }, this.level.shovelDropDelay);
    }


    stopShovelDrop() {
        if (this.shovelDropInterval) {
            clearInterval(this.shovelDropInterval);
            this.shovelDropInterval = null;
        }
    }

    // --- main game logic ----
    updateFallingGrass() { //update the grass from this.grass based on if caught or missed   
        for (let i = this.grass.length - 1; i >= 0; i--) {
            const currentGrass = this.grass[i];
            if (this.player.flash.getFlashDuration() === 0) {
                currentGrass.fall();
            } //stop grass fall if flashing is on or game is paused            

            if (currentGrass.isOffscreen() ||
                this.player.catches(currentGrass)) {
                this.grass.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    drawFallingGrass() { //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].draw();
        }
    }

    updateShovels() {
        if (this.level.level === 1) {
            return;
        }
        for (let i = this.shovels.length - 1; i >= 0; i--) {
            const currentShovel = this.shovels[i];
            if (this.player.flash.getFlashDuration() === 0) {
                currentShovel.fall();
            } //stop shovel fall if flashing is on or game is paused    

            if (currentShovel.hits(this.player)) {
                this.player.stack = []; //empty the stack
                this.player.flash.setFlashDuration(30); //trigger flash immediately
                this.shovels.splice(i, 1);
            } else if (currentShovel.isOffscreen()) {
                this.shovels.splice(i, 1);
            }
        }
    }


    drawShovels() {
        this.shovels.forEach(shovel => shovel.draw());
    }

    startLevelTimer() {
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);

        this.levelTimerInterval = setInterval(() => {
            if (this.level.timeLeft > 0) {
                if (this.player.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) this.level.timeLeft--;
            }
            else { //check when times run out
                this.stopGrassDrop();
                this.stopLevelTimer();
                this.stopShovelDrop();
                if (this.player.score >= this.level.targetScores) {
                    this.screenManager.changeScreen(this.levelSuccessScreen); //move up a level    
                } else {
                    this.screenManager.changeScreen(this.gameOverScreen); //game over
                }
            }
        }, 1000);
    }

    stopLevelTimer() {
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
            this.levelTimerInterval = null;
        }
    }

    clearStats() {
        this.player.reset();
        this.level.resetTimeLeft();
        this.grass = [];
        this.shovels = [];
        this.stopGrassDrop();
        this.stopShovelDrop();
        this.stopLevelTimer();
    }

    restartFromLevel1() {
        this.level.resetToLevel1();
        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { // restart from the current level
        this.clearStats();
        this.startGrassDrop();
        this.startShovelDrop();
        this.startLevelTimer();
    }

    displayUI() {
        this.basket.updateScore(this.player.score, this.level.targetScores);

        fill(255);
        textSize(20);
        stroke(0);
        strokeWeight(2);
        textStyle(BOLD);

        textAlign(CENTER);
        text(`Level ${this.level.level}`, baseWidth / 2, 30);

        textAlign(LEFT);
        text(`Time: ${this.level.timeLeft}s`, 20, 30);
        noStroke();
        textStyle(NORMAL);
    }

    startNextLevel() {
        this.level.startNextLevel();
        this.clearStats();
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

    loadBackgroundImage() {
        this.backgroundImage = loadImage("assets/barn.webp");
    }
}