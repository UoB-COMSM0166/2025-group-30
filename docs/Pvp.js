class Pvp extends GameScreen { // player with higher score in the set time wins
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.PVP);
        this.pvpLevelUpScreen = new PvpLevelUpScreen(this.screenManager, this);
        this.specialItems1 = [];
        this.specialItems2 = [];
        this.shovels1 = [];
        this.shovels2 = [];
        this.shovelDropInterval = null;
        this.particles1 = [];
        this.particles2 = [];
        this.previousScreen = null;

        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);
        //this.accomplishScreen = new AccomplishScreen(this.screenManager, this);
        this.pvpAccomplishScreen = new PvpAccomplishScreen(this.screenManager, this);
        this.player1 = new Player("pvpLeft");
        this.barrel1 = new Barrel("left");
        this.player1.barrel = this.barrel1;
        this.player1.soundManager = this.screenManager.soundManager;

        this.player2 = new Player("pvpRight");
        this.barrel2 = new Barrel("right");
        this.player2.barrel = this.barrel2;
        this.player2.soundManager = this.screenManager.soundManager;

        // initialize score for new game
        console.log('Initializing score');
        this.player1Wins = 0;
        this.player2Wins = 0;
    }

    display() {
        // Set global font
        textFont('Comic Sans MS');

        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.barrel1.draw();
        this.barrel2.draw();

        if (this.screenManager.currentScreen === this) { //stop updating when paused
            this.player1.movePlayerWithCaughtHay();
            this.player2.movePlayerWithCaughtHay();
            this.updateFallingHay();
            this.updateSpecialItems();
            this.updateParticles();
        }
        this.drawFallingHay();
        this.drawSpecialItems();
        this.drawParticles();
        this.player1.drawPlayerWithCaughtHay(); //show player with hay 
        this.player2.drawPlayerWithCaughtHay();

        this.displayUI();

        // Reset font
        textFont('sans-serif');
    }

    displayUI() {
        // Draw background box for level and score
        fill(255, 255, 255, 180);
        noStroke();
        rectMode(CENTER);
        rect(baseWidth / 2, 45, 250, 70, 15);
        rectMode(CORNER);

        // Display time
        fill(254, 224, 173);
        textSize(20);
        textStyle(BOLD);
        textAlign(LEFT);
        text(`Time: ${this.level.timeLeft}s`, 20, 30);
        textStyle(NORMAL);

        // Display level and score with new color
        fill(139, 69, 19);
        textStyle(BOLD);
        textAlign(CENTER);
        text(`Level ${this.level.level}`, baseWidth / 2, 35);

        // Display scores
        this.displayScores();

        // Call the game mode specific UI update
        this.updateScoreDisplay();
    }

    displayScores() {
        // display score
        fill(139, 69, 19);
        textSize(28);
        textAlign(CENTER);
        textStyle(BOLD);
        text(`Score: ${this.player1Wins} - ${this.player2Wins}`, baseWidth / 2, 65);
    }

    // --- initialising the game state ---

    startHayDrop() {
        if (this.hayDropInterval) {
            clearInterval(this.hayDropInterval);
            this.hayDropInterval = null;
        }

        this.resetHayArray();

        setTimeout(() => {
            this.hay1.push(new Hay(this.findSafePosition(10, baseWidth / 2 - 70, this.hay1, this.specialItems1), 10));
            this.hay2.push(new Hay(this.findSafePosition(baseWidth / 2, baseWidth - 70, this.hay2, this.specialItems2), 10));


            this.hayDropInterval = setInterval(() => {
                if (this.screenManager.currentScreen === this) {
                    if (this.player1.flash.getFlashDuration() === 0) {
                        this.hay1.push(new Hay(this.findSafePosition(10, baseWidth / 2 - 70, this.hay1, this.specialItems1), 10));
                    }
                    if (this.player2.flash.getFlashDuration() === 0) {
                        this.hay2.push(new Hay(this.findSafePosition(baseWidth / 2, baseWidth - 70, this.hay2, this.specialItems2), 10));
                    }
                }
            }, this.level.hayDropDelay);
        }, 1000);
    }

    startSpecialItemDrop() {
        if (this.level.level < 2) return; //special items starts from level 2
        if (this.specialItemDropInterval) clearInterval(this.specialItemDropInterval);
        if (this.shovelDropInterval) clearInterval(this.shovelDropInterval);

        this.resetSpecialItemsArray();
        this.resetShovelsArray();

        // special items drop
        this.specialItemDropInterval = setInterval(() => {
            if (this.screenManager.currentScreen === this) {
                if (this.player1.flash.getFlashDuration() === 0) {
                    this.generateSpecialItem(10, baseWidth / 2 - 70, this.specialItems1, this.shovels1, this.hay1);
                }
                if (this.player2.flash.getFlashDuration() === 0) {
                    this.generateSpecialItem(baseWidth / 2, baseWidth - 70, this.specialItems2, this.shovels2, this.hay2);
                }
            }
        }, this.level.specialItemDropDelay);

        // shovel drop
        this.shovelDropInterval = setInterval(() => {
            if (this.screenManager.currentScreen === this) {
                if (this.player1.flash.getFlashDuration() === 0) {
                    const newX = this.findSafePosition(10, baseWidth / 2 - 70, this.hay1, [...this.specialItems1, ...this.shovels1]);
                    if (this.level.level >= 2) {
                        this.shovels1.push(new Shovel(newX, 10));
                    }
                }
                if (this.player2.flash.getFlashDuration() === 0) {
                    const newX = this.findSafePosition(baseWidth / 2, baseWidth - 70, this.hay2, [...this.specialItems2, ...this.shovels2]);
                    if (this.level.level >= 2) {
                        this.shovels2.push(new Shovel(newX, 10));
                    }
                }
            }
        }, this.level.shovelDropDelay);
    }

    generateSpecialItem(left, right, specialItemsArray, shovelsArray, hayArray) {
        const newX = this.findSafePosition(left, right, hayArray, [...specialItemsArray, ...shovelsArray]);
        switch (this.level.level) {
            case 2:
                //no special item drop for level 2
                break;
            case 3:
                specialItemsArray.push(new SpeedBoot(newX, 10));
                break;
            case 4:
                specialItemsArray.push(new ProteinShake(newX, 10));
                break;
            case 5:
            default:
                if (random() < 0.5) {
                    specialItemsArray.push(new ProteinShake(newX + 50, 10));
                } else {
                    specialItemsArray.push(new SpeedBoot(newX + 50, 10));
                }
        }
    }

    // --- main game logic ----
    updateFallingHay() { //update the hay from this.hay based on if caught or missed   
        this.updateFallingHay1();
        this.updateFallingHay2();
    }

    updateFallingHay1() { //update the hay from this.hay1 based on if caught or missed   
        for (let i = this.hay1.length - 1; i >= 0; i--) {
            const currentHay = this.hay1[i];
            if (this.player1.flash.getFlashDuration() === 0) {
                currentHay.fall();
            } //stop hay fall if flashing is on or game is paused           

            if (currentHay.isOffscreen() ||
                this.player1.catches(currentHay)) {
                this.hay1.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    updateFallingHay2() { //update the hay from this.hay2 based on if caught or missed   
        for (let i = this.hay2.length - 1; i >= 0; i--) {
            const currentHay = this.hay2[i];
            if (this.player2.flash.getFlashDuration() === 0) {
                currentHay.fall(); //stop hay fall if flashing is on or game is paused           
            }
            if (currentHay.isOffscreen() ||
                this.player2.catches(currentHay)) {
                this.hay2.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    drawFallingHay() { //draw the hay
        for (let i = this.hay1.length - 1; i >= 0; i--) this.hay1[i].draw();
        for (let i = this.hay2.length - 1; i >= 0; i--) this.hay2[i].draw();
    }

    updateSpecialItems() {
        this.updateEachPlayerSpecialItems(this.player1, this.specialItems1);
        this.updateEachPlayerSpecialItems(this.player2, this.specialItems2);
        this.updateEachPlayerSpecialItems(this.player1, this.shovels1);
        this.updateEachPlayerSpecialItems(this.player2, this.shovels2);
    }

    drawSpecialItems() {
        this.specialItems1.forEach(item => item.draw());
        this.specialItems2.forEach(item => item.draw());
        this.shovels1.forEach(item => item.draw());
        this.shovels2.forEach(item => item.draw());
    }

    updateParticles() {
        this.updateEachPlayerParticles(this.player1, this.particles1);
        this.updateEachPlayerParticles(this.player2, this.particles2);
    }

    updateEachPlayerParticles(player, particles) {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].isDead()) {
                particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles1.forEach(particle => particle.draw());
        this.particles2.forEach(particle => particle.draw());
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
                this.stopHayDrop();
                this.stopLevelTimer();
                this.stopSpecialItemDrop();
                // update score before entering next level
                if (this.player1.score > this.player2.score) {
                    this.player1Wins++;
                } else if (this.player2.score > this.player1.score) {
                    this.player2Wins++;
                }
                // if draw, no score added

                if (this.level.level >= 5) {
                    this.pvpAccomplishScreen.setFinalScore(this.player1Wins, this.player2Wins);
                    this.screenManager.changeScreen(this.pvpAccomplishScreen);
                } else {
                    this.screenManager.changeScreen(this.pvpLevelUpScreen);
                }
            }
        }, 1000);
    }

    resetPlayers() {
        this.player1.reset();
        this.player2.reset();
    }

    resetHayArray() {
        this.hay1 = [];
        this.hay2 = [];
    }

    resetSpecialItemsArray() {
        this.specialItems1 = [];
        this.specialItems2 = [];
        this.shovels1 = [];
        this.shovels2 = [];
    }

    resetShovelsArray() {
        this.shovels1 = [];
        this.shovels2 = [];
    }

    resetParticles() {
        this.particles1 = [];
        this.particles2 = [];
    }

    updateScoreDisplay() {
        // Update both barrels' scores
        this.barrel1.updateScore(this.player1.score, 0);
        this.barrel2.updateScore(this.player2.score, 0);

        // Draw the center line
        stroke(254, 224, 173);
        line(baseWidth / 2, 80, baseWidth / 2, baseHeight);
        noStroke();
    }

    //--- Move to next level ---
    startNextLevel() {

        if (this.level.level >= 5) {
            return;
        } else {
            this.level.startNextLevel();
            this.clearStats();
            this.startLevelTimer();
            this.startHayDrop();
            this.startSpecialItemDrop();
        }
    }

    keyPressed() {
        if (keyCode === RIGHT_ARROW) this.player2.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player2.dir = -1;
        else if (keyCode === ENTER) this.player2.emptyToBarrel();

        else if (keyCode === 68) this.player1.dir = 1; // D
        else if (keyCode === 65) this.player1.dir = -1; // A
        else if (keyCode === 32) this.player1.emptyToBarrel(); //spacebar    

        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === 68 || keyCode === 65) this.player1.dir = 0;
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player2.dir = 0;
    }

    stopSpecialItemDrop() {
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }
        if (this.shovelDropInterval) {
            clearInterval(this.shovelDropInterval);
            this.shovelDropInterval = null;
        }
    }

    resetScore() {
        console.log('Resetting score');
        this.player1Wins = 0;
        this.player2Wins = 0;
    }
}