class Coop extends GameScreen {
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.COOP);
        this.specialItems = [];
        this.shovels = [];
        this.shovelDropInterval = null;
        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);
        this.accomplishScreen = new AccomplishScreen(this.screenManager, this);
        this.player1 = new Player("left");
        this.player2 = new Player("right");
        this.barrel = new Barrel("left");
        this.player1.barrel = this.barrel;
        this.player2.barrel = this.barrel;

        this.player1.soundManager = this.screenManager.soundManager;
        this.player2.soundManager = this.screenManager.soundManager;

        // initialize special item time for each player
        this.player1.specialItemTimeLeft = 0;
        this.player2.specialItemTimeLeft = 0;
    }

    display() {
        textFont('Comic Sans MS');

        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.barrel.draw();

        if (this.screenManager.currentScreen === this) {
            this.player1.movePlayerWithCaughtHay();
            this.player2.movePlayerWithCaughtHay();
            this.updateFallingHay();
            this.updateSpecialItems();
            this.checkPerfectStack();
            this.updateParticles();
        }

        this.drawFallingHay();
        this.drawSpecialItems();
        this.player1.drawPlayerWithCaughtHay(); //show player with hay 
        this.player2.drawPlayerWithCaughtHay();
        this.drawParticles();
        this.displayUI();

        textFont('sans-serif');
    }

    displayUI() {
        // Common UI elements
        fill(254, 224, 173); 
        textSize(20);
        textStyle(BOLD);

        // Display level
        textAlign(CENTER);
        text(`Level ${this.level.level}`, baseWidth / 2, 30);

        // Display time
        textAlign(LEFT);
        text(`Time: ${this.level.timeLeft}s`, 20, 30);
        textStyle(NORMAL);

        if (this.level.timeLeft > 0) {
            // Display special item timers for each player
            if (this.player) {
                this.displaySpecialItemTimers(this.player);
            } else if (this.player1 && this.player2) {
                this.displaySpecialItemTimers(this.player1);
                this.displaySpecialItemTimers(this.player2);
            }
        }

        // Call the game mode specific UI update
        this.updateScoreDisplay();
    }

    // --- initialising the game state ---

    startHayDrop() {
        if (this.hayDropInterval) {
            clearInterval(this.hayDropInterval);
            this.hayDropInterval = null;
        }

        this.resetHayArray();

        setTimeout(() => {
            if (this.hayDropInterval === null) {
                let firstX = this.findSafePosition(50, baseWidth - 70, this.hay, this.specialItems);
                this.hay.push(new Hay(firstX, 10));

                this.hayDropInterval = setInterval(() => {
                    if ((this.player1.flash.getFlashDuration() === 0 ||
                        this.player2.flash.getFlashDuration() === 0) &&
                        this.screenManager.currentScreen === this) {
                        let newX = this.findSafePosition(50, baseWidth - 70, this.hay, this.specialItems);
                        this.hay.push(new Hay(newX, 10));
                    }
                }, this.level.hayDropDelay);
            }
        }, 1000);
    }

    startSpecialItemDrop() {
        if (this.level.level === 1) return; //special items starts from level 2
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }
        if (this.shovelDropInterval) {
            clearInterval(this.shovelDropInterval);
            this.shovelDropInterval = null;
        }

        this.resetSpecialItemsArray();
        this.resetShovelsArray();

        // special items drop
        this.specialItemDropInterval = setInterval(() => {
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0) &&
                this.screenManager.currentScreen === this) {

                const newX = this.findSafePosition(50, baseWidth - 70, this.hay, [...this.specialItems, ...this.shovels]);

                switch (this.level.level) {
                    case 3:
                        this.specialItems.push(new SpeedBoot(newX, 10));
                        break;
                    case 4:
                        this.specialItems.push(new ProteinShaker(newX, 10));
                        break;
                    case 5:
                        if (random() < 0.5) {
                            this.specialItems.push(new ProteinShaker(newX + 50, 10));
                        } else {
                            this.specialItems.push(new SpeedBoot(newX + 50, 10));
                        }
                }
            }
        }, this.level.specialItemDropDelay);

        // shovel drop
        this.shovelDropInterval = setInterval(() => {
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0) &&
                this.screenManager.currentScreen === this) {

                const newX = this.findSafePosition(50, baseWidth - 70, this.hay, [...this.specialItems, ...this.shovels]);

                if (this.level.level >= 2) {
                    this.shovels.push(new Shovel(newX, 10));
                }
            }
        }, this.level.shovelDropDelay);
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

    // --- main game logic ----
    updateFallingHay() { //update the hay from this.hay based on if caught or missed   
        for (let i = this.hay.length - 1; i >= 0; i--) {
            const currentHay = this.hay[i];
            if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0)) {
                currentHay.fall();
            } //stop hay fall if flashing is on or game is paused

            if (this.player1.catches(currentHay) ||
                this.player2.catches(currentHay) ||
                currentHay.isOffscreen()) {
                this.hay.splice(i, 1);
            }
        }
    }

    drawFallingHay() {
        for (let i = 0; i < this.hay.length; i++) {
            this.hay[i].draw();
        }
    }

    checkPerfectStack() {
        this.checkEachPlayerPerfectStack(this.player1, this.particles1);
        this.checkEachPlayerPerfectStack(this.player2, this.particles2);
    }

    updateSpecialItems() {
        if (this.level.level === 1) {
            return;
        }
        for (let i = this.specialItems.length - 1; i >= 0; i--) {
            const currentItem = this.specialItems[i];
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0)) {
                currentItem.fall();
            } //stop fall if flashing is on or game is paused    

            if (currentItem.hits(this.player1) && currentItem.hits(this.player2)) {
                currentItem.applyEffect(this.player1, this);
                currentItem.applyEffect(this.player2, this);
                this.player1.specialItemTimeLeft = currentItem.timeLeft;
                this.player2.specialItemTimeLeft = currentItem.timeLeft;
                this.specialItems.splice(i, 1);
            } else if (currentItem.hits(this.player1)) {
                currentItem.applyEffect(this.player1, this);
                this.player1.specialItemTimeLeft = currentItem.timeLeft;
                this.specialItems.splice(i, 1);
            } else if (currentItem.hits(this.player2)) {
                currentItem.applyEffect(this.player2, this);
                this.player2.specialItemTimeLeft = currentItem.timeLeft;
                this.specialItems.splice(i, 1);
            } else if (currentItem.isOffscreen()) {
                this.specialItems.splice(i, 1);
            }
        }

        // update special item time for each player
        if (this.player1.specialItemTimeLeft > 0) {
            this.player1.specialItemTimeLeft -= 0.05;
        }
        if (this.player2.specialItemTimeLeft > 0) {
            this.player2.specialItemTimeLeft -= 0.05;
        }

        // update shovels
        for (let i = this.shovels.length - 1; i >= 0; i--) {
            const currentItem = this.shovels[i];
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0)) {
                currentItem.fall();
            }

            if (currentItem.hits(this.player1) && currentItem.hits(this.player2)) {
                currentItem.applyEffect(this.player1, this);
                currentItem.applyEffect(this.player2, this);
                this.shovels.splice(i, 1);
            } else if (currentItem.hits(this.player1)) {
                currentItem.applyEffect(this.player1, this);
                this.shovels.splice(i, 1);
            } else if (currentItem.hits(this.player2)) {
                currentItem.applyEffect(this.player2, this);
                this.shovels.splice(i, 1);
            } else if (currentItem.isOffscreen()) {
                this.shovels.splice(i, 1);
            }
        }
    }

    drawSpecialItems() {
        this.specialItems.forEach(item => item.draw());
        this.shovels.forEach(item => item.draw());
    }

    updateParticles() {
        this.updateEachPlayerParticles(this.player1, this.particles1);
        this.updateEachPlayerParticles(this.player2, this.particles2);
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
                    this.level.timeLeft--;
                } //time goes down for both player during flashing
            }
            else { //check when times run out
                this.stopHayDrop();
                this.stopSpecialItemDrop();
                this.stopLevelTimer();
                if ((this.player1.score + this.player2.score) >= this.level.targetScores) {
                    if (this.level.level >= 5) {
                        this.screenManager.changeScreen(this.accomplishScreen);
                    } else {
                        this.screenManager.changeScreen(this.levelSuccessScreen);
                    }
                } else {
                    this.screenManager.changeScreen(this.gameOverScreen);
                }
            }
        }, 1000);
    }

    resetPlayers() {
        this.player1.reset();
        this.player2.reset();
    }

    resetHayArray() {
        this.hay = [];
    }

    resetSpecialItemsArray() {
        this.specialItems = [];
        this.shovels = [];
    }

    resetShovelsArray() {
        this.shovels = [];
    }

    resetParticles() {
        this.particles1 = [];
        this.particles2 = [];
    }

    updateScoreDisplay() {
        this.barrel.updateScore(this.player1.score + this.player2.score, this.level.targetScores);
    }

    //--- Move to next level ---
    startNextLevel() {
        this.clearStats();
        if (this.level.level >= 5) {
            this.screenManager.changeScreen(this.accomplishScreen);
        } else {
            this.level.startNextLevel();
            this.screenManager.changeScreen(this.targetScoreScreen);
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
/*
    displaySpecialItemTimers(player) {
        if (player.specialItemTimeLeft > 0) {
            const x = player === this.player1 ? 20 : baseWidth - 120;
            fill(255, 255, 0);
            textSize(16);
            textAlign(LEFT);
            text(`Special Item: ${player.specialItemTimeLeft.toFixed(1)}s`, x, 60);
        }
    }*/
    displaySpecialItemTimers(player) {
        const x = player === this.player1 ? 20 : baseWidth - 200;
        // Only show when speed buff is active
        if (player.speedBoot) {
            const remainingTime = player.speedBoot.timeLeft;
            if (remainingTime > 0) {
                push();
                fill(254, 224, 173); // Set to specified RGB color
                textSize(20);
                textAlign(LEFT);
                text(`Speed boost: ${remainingTime.toFixed(0)}s`, x, 60);
                pop();
            }
        }

        // Only show when strength buff is active
        if (player.proteinShaker) {
            const remainingTime = player.proteinShaker.timeLeft;
            if (remainingTime > 0) {
                push();
                fill(254, 224, 173); // Set to specified RGB color
                textSize(20);
                textAlign(LEFT);
                text(`Strength boost: ${remainingTime.toFixed(0)}s`, x, 90);
                pop();
            }
        }
    }

}