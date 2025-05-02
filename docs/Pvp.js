class Pvp extends GameScreen { // player with higher score in the set time wins
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.PVP);
        this.pvpLevelUpScreen = new PvpLevelUpScreen(this.screenManager, this);

        this.player1 = new Player("pvpLeft");
        this.basket1 = new Basket("left");
        this.player1.basket = this.basket1;

        this.player2 = new Player("pvpRight");
        this.basket2 = new Basket("right");
        this.player2.basket = this.basket2;
    }

    display() {
        // Set global font
        textFont('Comic Sans MS');
        
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket1.draw();
        this.basket2.draw();

        if (this.screenManager.currentScreen === this) {
            this.player1.movePlayerWithCaughtGrass();
            this.player2.movePlayerWithCaughtGrass();
            this.updateFallingGrass();
            this.updateSpecialItems();
        }

        this.drawFallingGrass();
        this.drawSpecialItems();
        this.player1.drawPlayerWithCaughtGrass(); //show player with grass 
        this.player2.drawPlayerWithCaughtGrass();

        this.displayUI();
        
        // Reset font
        textFont('sans-serif');
    }

    displayUI() {
        // Common UI elements
        fill(254, 224, 173); // Set to specified RGB color
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
        // 移除所有显示道具时间的文本
        return;
    }

    // --- initialising the game state ---

    startGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }

        this.resetGrassArray();

        setTimeout(() => {
            this.grass1.push(new Grass(this.findSafePosition(10, baseWidth / 2 - 70, this.grass1, this.specialItems1), 10));
            this.grass2.push(new Grass(this.findSafePosition(baseWidth / 2, baseWidth - 70, this.grass2, this.specialItems2), 10));


            this.grassDropInterval = setInterval(() => {
                if (this.screenManager.currentScreen === this) {
                    if (this.player1.flash.getFlashDuration() === 0) {
                        this.grass1.push(new Grass(this.findSafePosition(10, baseWidth / 2 - 70, this.grass1, this.specialItems1), 10));
                    }
                    if (this.player2.flash.getFlashDuration() === 0) {
                        this.grass2.push(new Grass(this.findSafePosition(baseWidth / 2, baseWidth - 70, this.grass2, this.specialItems2), 10));
                    }
                }
            }, this.level.grassDropDelay);
        }, 1000);
    }

    startSpecialItemDrop() {
        if (this.level.level === 1) return;
        if (this.specialItemDropInterval) clearInterval(this.specialItemDropInterval);

        this.resetSpecialItemsArray();

        this.specialItemDropInterval = setInterval(() => {
            if (this.screenManager.currentScreen === this) {

                if (this.player1.flash.getFlashDuration() === 0) {
                    this.generateSpecialItem(10, baseWidth / 2 - 70, this.specialItems1, this.grass1);
                }
                if (this.player2.flash.getFlashDuration() === 0) {
                    this.generateSpecialItem(baseWidth / 2, baseWidth - 70, this.specialItems2, this.grass2);
                }
            }
        }, this.level.specialItemDropDelay);
    }

    generateSpecialItem(left, right, specialItemsArray, grassArray) {
        const newX = this.findSafePosition(left, right, grassArray, specialItemsArray);
        switch (this.level.level) {
            case 2:
                specialItemsArray.push(new Shovel(newX, 10));
                break;
            case 3:
                specialItemsArray.push(new SpeedBoot(newX, 10));
                break;
            case 4:
                specialItemsArray.push(new ProteinShaker(newX, 10));
                break;
            case 5:
            default:
                // Shovel drops independently
                if (random() < 0.5) { // 50% chance for shovel
                    specialItemsArray.push(new Shovel(newX, 10));
                } else {
                    // Random drop between the other two items
                    if (random() < 0.5) { // 50% chance for protein shaker
                        specialItemsArray.push(new ProteinShaker(newX + 50, 10));
                    } else { // 50% chance for speed boot
                        specialItemsArray.push(new SpeedBoot(newX + 50, 10));
                    }
                }
        }
    }

    // --- main game logic ----
    updateFallingGrass() { //update the grass from this.grass based on if caught or missed   
        this.updateFallingGrass1();
        this.updateFallingGrass2();
    }

    updateFallingGrass1() { //update the grass from this.grass1 based on if caught or missed   
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

    updateFallingGrass2() { //update the grass from this.grass2 based on if caught or missed   
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

    updateSpecialItems() {
        this.updateEachPlayerSpecialItems(this.player1, this.specialItems1);
        this.updateEachPlayerSpecialItems(this.player2, this.specialItems2);
    }

    drawSpecialItems() {
        this.specialItems1.forEach(item => item.draw());
        this.specialItems2.forEach(item => item.draw());
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
                    this.level.timeLeft--; //time goes down for both player even if one player is flashing
                }
            }
            else { //check when times run out
                this.stopGrassDrop();
                this.stopLevelTimer();
                this.stopSpecialItemDrop();
                this.screenManager.changeScreen(this.pvpLevelUpScreen);
            }
        }, 1000);
    }

    resetPlayers() {
        this.player1.reset();
        this.player2.reset();
    }

    resetGrassArray() {
        this.grass1 = [];
        this.grass2 = [];
    }

    resetSpecialItemsArray() {
        this.specialItems1 = [];
        this.specialItems2 = [];
    }

    resetParticles() {
        this.particles1 = [];
        this.particles2 = [];
    }

    updateScoreDisplay() {
        // Update both baskets' scores
        this.basket1.updateScore(this.player1.score, 0);
        this.basket2.updateScore(this.player2.score, 0);

        // Draw the center line
        stroke(254, 224, 173);
        line(baseWidth / 2, 50, baseWidth / 2, baseHeight); // Start from y=50 to avoid overlapping with level text
        noStroke();
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
}