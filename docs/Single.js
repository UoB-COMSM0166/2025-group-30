class Single extends GameScreen {
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.SINGLE);

        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);
        this.accomplishScreen = new AccomplishScreen(this.screenManager, this);

        this.player = new Player("middle");
        this.barrel = new Barrel("left");
        this.player.barrel = this.barrel;
    }

    display() {
        // Set global font
        textFont('Comic Sans MS');

        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.barrel.draw();

        if (this.screenManager.currentScreen === this) { //stop updating when paused
            this.player.movePlayerWithCaughtHay();
            this.updateFallingHay();
            this.updateSpecialItems();
            this.checkPerfectStack();
            this.updateParticles();
        }
        this.drawFallingHay();
        this.drawSpecialItems();
        this.drawParticles();
        this.player.drawPlayerWithCaughtHay(); //show player with hay   

        this.displayUI();

        // Reset font
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

    displaySpecialItemTimers(player) {
        // Only show when speed buff is active
        if (player.speedBoot) {
            const remainingTime = player.speedBoot.timeLeft;
            if (remainingTime > 0) {
                push();
                fill(254, 224, 173); // Set to specified RGB color
                textSize(20);
                textAlign(LEFT);
                text(`Speed boost: ${remainingTime.toFixed(0)}s`, 20, 60);
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
                text(`Strength boost: ${remainingTime.toFixed(0)}s`, 20, 90);
                pop();
            }
        }
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
                    if (this.player.flash.getFlashDuration() === 0
                        && this.screenManager.currentScreen === this) {
                        let newX = this.findSafePosition(50, baseWidth - 70, this.hay, this.specialItems);
                        this.hay.push(new Hay(newX, 10));
                    }
                }, this.level.hayDropDelay);
            }
        }, 1000);
    }

    startSpecialItemDrop() {
        if (this.level.level === 1) return; //special items start from level 2
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }

        this.resetSpecialItemsArray();

        this.specialItemDropInterval = setInterval(() => {
            if (this.player.flash.getFlashDuration() === 0
                && this.screenManager.currentScreen === this) {

                const newX = this.findSafePosition(50, baseWidth - 70, this.hay, this.specialItems);

                switch (this.level.level) {
                    case 2:
                        this.specialItems.push(new Shovel(newX, 10));
                        break;
                    case 3:
                        this.specialItems.push(new SpeedBoot(newX, 10));
                        break;
                    case 4:
                        this.specialItems.push(new ProteinShaker(newX, 10));
                        break;
                    case 5:
                        // Shovel drops independently
                        if (random() < 0.5) { // 50% chance for shovel
                            this.specialItems.push(new Shovel(newX, 10));
                        } else {
                            // Random drop between the other two items
                            if (random() < 0.5) { // 50% chance for protein shaker
                                this.specialItems.push(new ProteinShaker(newX + 50, 10));
                            } else { // 50% chance for speed boot
                                this.specialItems.push(new SpeedBoot(newX + 50, 10));
                            }
                        }
                }
            }
        }, this.level.specialItemDropDelay);
    }

    // --- main game logic ----
    updateFallingHay() { //update the hay from this.hay based on if caught or missed   
        for (let i = this.hay.length - 1; i >= 0; i--) {
            const currentHay = this.hay[i];
            if (this.player.flash.getFlashDuration() === 0) {
                currentHay.fall();
            } //stop hay fall if flashing is on or game is paused            

            if (currentHay.isOffscreen() ||
                this.player.catches(currentHay)) {
                this.hay.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    drawFallingHay() { //draw the hay
        for (let i = this.hay.length - 1; i >= 0; i--) {
            this.hay[i].draw();
        }
    }

    checkPerfectStack() {
        this.checkEachPlayerPerfectStack(this.player, this.particles);
    }

    updateSpecialItems() {
        this.updateEachPlayerSpecialItems(this.player, this.specialItems);
    }

    drawSpecialItems() {
        this.specialItems.forEach(item => item.draw());
    }

    updateParticles() {
        this.updateEachPlayerParticles(this.player, this.particles);
    }

    drawParticles() {
        this.particles.forEach(particle => particle.draw());
    }

    startLevelTimer() {
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);

        this.levelTimerInterval = setInterval(() => {
            if (this.level.timeLeft > 0) {
                if (this.player.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) {
                    this.level.timeLeft--;
                }
            }
            else { //check when times run out
                this.stopHayDrop();
                this.stopLevelTimer();
                this.stopSpecialItemDrop();
                if (this.player.score >= this.level.targetScores) {
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
        this.player.reset();
    }

    resetHayArray() {
        this.hay = [];
    }

    resetSpecialItemsArray() {
        this.specialItems = [];
    }

    resetParticles() {
        this.particles = [];
    }

    updateScoreDisplay() {
        this.barrel.updateScore(this.player.score, this.level.targetScores);
    }

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
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.player.emptyToBarrel(); //spacebar    
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }
}