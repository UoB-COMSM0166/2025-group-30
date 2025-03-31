class Pvp extends Screen { // player with higher score in the set time wins
    constructor(screenManager, level = 1) {
        // --- basic settings ---
        super(screenManager);
        this.backgroundImage = null;
        this.loadBackgroundImage();

        // --- level related settings ---
        this.level = new Level(Level.GAME_MODES.PVP, level);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.pvpLevelUpScreen = new PvpLevelUpScreen(this.screenManager, this);

        this.player1 = new Player("pvpLeft");
        this.basket1 = new Basket("left");
        this.player1.basket = this.basket1;
        this.grass1 = []; //collection of falling grass
        this.shovels1 = [];

        this.player2 = new Player("pvpRight");
        this.basket2 = new Basket("right");
        this.player2.basket = this.basket2;
        this.grass2 = []; //collection of falling grass
        this.shovels2 = [];

        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second
        this.shovelDropInterval = null;
    }

    display() {
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket1.draw();
        this.basket2.draw();

        if (this.screenManager.currentScreen === this) {
            this.player1.movePlayerWithCaughtGrass();
            this.player2.movePlayerWithCaughtGrass();
            this.updateFallingGrass();
            this.updateShovels();
        }

        this.drawFallingGrass();
        this.drawShovels();
        this.player1.drawPlayerWithCaughtGrass(); //show player with grass 
        this.player2.drawPlayerWithCaughtGrass();

        this.displayUI();
    }

    // --- initialising the game state ---

    startGrassDrop() {
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);

        this.grass1 = []; //empty the grass piles
        this.grass2 = [];

        setTimeout(() => {
            this.grass1.push(new Grass(random(200, baseWidth / 2 - 100), 10));
            this.grass2.push(new Grass(random(baseWidth / 2, baseWidth - 100), 10));

            this.grassDropInterval = setInterval(() => {
                if (this.screenManager.currentScreen === this) {
                    if (this.player1.flash.getFlashDuration() === 0) {
                        this.grass1.push(new Grass(random(200, baseWidth / 2 - 100), 10));
                    }
                    if (this.player2.flash.getFlashDuration() === 0) {
                        this.grass2.push(new Grass(random(baseWidth / 2, baseWidth - 100), 10));
                    }
                }
            }, this.level.grassDropDelay);
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
        if (this.shovelDropInterval) clearInterval(this.shovelDropInterval);

        this.shovels1 = [];
        this.shovels2 = [];

        this.grassDropInterval = setInterval(() => {
            if (this.screenManager.currentScreen === this) {
                if (this.player1.flash.getFlashDuration() === 0) {
                    this.shovels1.push(new Shovel(random(200, baseWidth / 2 - 100), 10));
                }
                if (this.player2.flash.getFlashDuration() === 0) {
                    this.shovels2.push(new Shovel(random(baseWidth / 2, baseWidth - 100), 10));
                }
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
        this.updateGrass1();
        this.updateGrass2();
    }

    updateGrass1() { //update the grass from this.grass1 based on if caught or missed   
        for (let i = this.grass1.length - 1; i >= 0; i--) {
            const currentGrass = this.grass1[i];
            if (this.player1.flash.getFlashDuration() === 0) {
                currentGrass.fall();
            } //stop grass fall if flashing is on or game is paused           

            if (currentGrass.isOffscreen() ||
                this.player1.catches(currentGrass)) {
                this.grass1.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    updateGrass2() { //update the grass from this.grass2 based on if caught or missed   
        for (let i = this.grass2.length - 1; i >= 0; i--) {
            const currentGrass = this.grass2[i];
            if (this.player2.flash.getFlashDuration() === 0) {
                currentGrass.fall(); //stop grass fall if flashing is on or game is paused           
            }
            if (currentGrass.isOffscreen() ||
                this.player2.catches(currentGrass)) {
                this.grass2.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    drawFallingGrass() { //draw the grass
        for (let i = this.grass1.length - 1; i >= 0; i--) this.grass1[i].draw();
        for (let i = this.grass2.length - 1; i >= 0; i--) this.grass2[i].draw();
    }

    updateShovels() {
        this.updateShovels1();
        this.updateShovels2();
    }

    updateShovels1() {
        if (this.level.level === 1) {
            return;
        }
        for (let i = this.shovels1.length - 1; i >= 0; i--) {
            const currentShovel = this.shovels1[i];
            if (this.player1.flash.getFlashDuration() === 0) {
                currentShovel.fall();
            } //stop shovel fall if flashing is on or game is paused    

            if (currentShovel.hits(this.player1)) {
                this.player1.stack = []; //empty the stack
                this.player1.flash.setFlashDuration(30); //trigger flash immediately
                this.shovels1.splice(i, 1);
                continue;
            }

            if (currentShovel.isOffscreen()) {
                this.shovels1.splice(i, 1);
            }
        }
    }

    updateShovels2() {
        if (this.level.level === 1) {
            return;
        }
        for (let i = this.shovels2.length - 1; i >= 0; i--) {
            const currentShovel = this.shovels2[i];
            if (this.player2.flash.getFlashDuration() === 0) {
                currentShovel.fall();
            } //stop shovel fall if flashing is on or game is paused    

            if (currentShovel.hits(this.player2)) {
                this.player2.stack = []; //empty the stack
                this.player2.flash.setFlashDuration(30); //trigger flash immediately
                this.shovels2.splice(i, 1);
            } else if (currentShovel.isOffscreen()) {
                this.shovels2.splice(i, 1);
            }
        }
    }

    drawShovels() {
        this.shovels1.forEach(shovel => shovel.draw());
        this.shovels2.forEach(shovel => shovel.draw());
    }

    startLevelTimer() {
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.level.timeLeft > 0) {
                if (this.screenManager.currentScreen === this) {
                    this.level.timeLeft--; //time goes down for both player even if one player is flashing
                }
            }
            else { //check when times run out
                this.stopGrassDrop();
                this.stopLevelTimer();
                this.stopShovelDrop();
                this.screenManager.changeScreen(this.pvpLevelUpScreen);
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
        this.player1.reset();
        this.player2.reset();
        this.level.resetTimeLeft();
        this.grass1 = [];
        this.grass2 = [];
        this.shovels1 = [];
        this.shovels2 = [];
        this.stopGrassDrop();
        this.stopShovelDrop();
        this.stopLevelTimer();
    }

    restartFromLevel1() {
        this.level.resetToLevel1();
        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() {
        this.clearStats();
        this.startGrassDrop();
        this.startShovelDrop();
        this.startLevelTimer();
    }

    displayUI() {
        // 更新两个篮子的分数，只显示当前得分
        this.basket1.updateScore(this.player1.score, 0);
        this.basket2.updateScore(this.player2.score, 0);

        stroke(0);
        line(baseWidth / 2, 0, baseWidth / 2, baseHeight);
        noStroke();

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

    //--- Move to next level ---
    startNextLevel() {
        this.level.startNextLevel();
        this.clearStats();
        this.restartFromCurrentLevel(); //no target score screen in pvp
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

    loadBackgroundImage() {
        this.backgroundImage = loadImage("assets/barn.webp");
    }
}