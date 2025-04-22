class Single extends GameScreen {
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.SINGLE);

        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);

        this.player = new Player("middle");
        this.basket = new Basket("left");
        this.player.basket = this.basket;
    }

    display() {
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket.draw();

        if (this.screenManager.currentScreen === this) { //stop updating when paused
            this.player.movePlayerWithCaughtGrass();
            this.updateFallingGrass();
            this.updateSpecialItems();
            this.checkPerfectStack();
            this.updateParticles();
        }
        this.drawFallingGrass();
        this.drawSpecialItems();
        this.drawParticles();
        this.player.drawPlayerWithCaughtGrass(); //show player with grass   

        this.displayUI();
    }

    // --- initialising the game state ---

    startGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }

        this.resetGrassArray();

        setTimeout(() => {
            if (this.grassDropInterval === null) {
                let firstX = this.findSafePosition(50, baseWidth - 70, this.grass, this.specialItems);
                this.grass.push(new Grass(firstX, 10));

                this.grassDropInterval = setInterval(() => {
                    if (this.player.flash.getFlashDuration() === 0
                        && this.screenManager.currentScreen === this) {
                        let newX = this.findSafePosition(50, baseWidth - 70, this.grass, this.specialItems);
                        this.grass.push(new Grass(newX, 10));
                    }
                }, this.level.grassDropDelay);
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

                const newX = this.findSafePosition(50, baseWidth - 70, this.grass, this.specialItems);

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
                        //Randomly choose which special item to drop
                        if (random() < 0.33) { // 33% chance for shovel
                            this.specialItems.push(new Shovel(newX, 10));
                        } else if (random() < 0.66) { // 33% chance for protein shaker
                            this.specialItems.push(new ProteinShaker(newX, 10));
                        } else { // 33% chance for speed boot
                            this.specialItems.push(new SpeedBoot(newX, 10));
                        }
                }
            }
        }, this.level.specialItemDropDelay);
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
                if (this.player.flash.getFlashDuration() === 0 && this.screenManager.currentScreen === this) this.level.timeLeft--;
            }
            else { //check when times run out
                this.stopGrassDrop();
                this.stopLevelTimer();
                this.stopSpecialItemDrop();
                if (this.player.score >= this.level.targetScores) {
                    this.screenManager.changeScreen(this.levelSuccessScreen); //move up a level    
                } else {
                    this.screenManager.changeScreen(this.gameOverScreen); //game over
                }
            }
        }, 1000);
    }

    resetPlayers() {
        this.player.reset();
    }

    resetGrassArray() {
        this.grass = [];
    }

    resetSpecialItemsArray() {
        this.specialItems = [];
    }

    resetParticles() {
        this.particles = [];
    }

    updateScoreDisplay() {
        this.basket.updateScore(this.player.score, this.level.targetScores);
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

}