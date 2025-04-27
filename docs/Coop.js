class Coop extends GameScreen {
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.COOP);

        this.gameOverScreen = new GameOverScreen(this.screenManager, this);
        this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.targetScoreScreen = new TargetScoreScreen(this.screenManager, this);
        this.accomplishScreen = new AccomplishScreen(this.screenManager, this);
        this.player1 = new Player("left");
        this.player2 = new Player("right");
        this.basket = new Basket("left");
        this.player1.basket = this.basket;
        this.player2.basket = this.basket;
    }

    display() {
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);
        this.basket.draw();

        if (this.screenManager.currentScreen === this) {
            this.player1.movePlayerWithCaughtGrass();
            this.player2.movePlayerWithCaughtGrass();
            this.updateFallingGrass();
            this.updateSpecialItems();
            this.checkPerfectStack();
            this.updateParticles();
        }

        this.drawFallingGrass();
        this.drawSpecialItems();
        this.player1.drawPlayerWithCaughtGrass(); //show player with grass 
        this.player2.drawPlayerWithCaughtGrass();
        this.drawParticles();
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
                    if ((this.player1.flash.getFlashDuration() === 0 ||
                        this.player2.flash.getFlashDuration() === 0) &&
                        this.screenManager.currentScreen === this) {
                        let newX = this.findSafePosition(50, baseWidth - 70, this.grass, this.specialItems);
                        this.grass.push(new Grass(newX, 10));
                    }
                }, this.level.grassDropDelay);
            }
        }, 1000);
    }

    startSpecialItemDrop() {
        if (this.level.level === 1) return; //special items starts from level 2
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }

        this.resetSpecialItemsArray();

        this.specialItemDropInterval = setInterval(() => {
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0) &&
                this.screenManager.currentScreen === this) {

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
                        // 铲子独立掉落
                        if (random() < 0.5) { // 50% 概率掉铲子
                            this.specialItems.push(new Shovel(newX, 10));
                        } else {
                            // 另外两种物品随机掉
                            if (random() < 0.5) { // 50% 概率掉蛋白粉
                                this.specialItems.push(new ProteinShaker(newX + 50, 10));
                            } else { // 50% 概率掉速度靴
                                this.specialItems.push(new SpeedBoot(newX + 50, 10));
                            }
                        }

                }
            }
        }, this.level.specialItemDropDelay);
    }

    // --- main game logic ----
    updateFallingGrass() { //update the grass from this.grass based on if caught or missed   
        for (let i = this.grass.length - 1; i >= 0; i--) {
            const currentGrass = this.grass[i];
            if ((this.player1.flash.getFlashDuration() === 0 || this.player2.flash.getFlashDuration() === 0)) {
                currentGrass.fall();
            } //stop grass fall if flashing is on or game is paused

            if (this.player1.catches(currentGrass) ||
                this.player2.catches(currentGrass) ||
                currentGrass.isOffscreen()) {
                this.grass.splice(i, 1);
            }
        }
    }

    drawFallingGrass() {
        for (let i = 0; i < this.grass.length; i++) {
            this.grass[i].draw();
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
                this.specialItems.splice(i, 1);
            } else if (currentItem.hits(this.player1)) {
                currentItem.applyEffect(this.player1, this);
                this.specialItems.splice(i, 1);
            } else if (currentItem.hits(this.player2)) {
                currentItem.applyEffect(this.player2, this);
                this.specialItems.splice(i, 1);
            } else if (currentItem.isOffscreen()) {
                this.specialItems.splice(i, 1);
            }
        }
    }

    drawSpecialItems() {
        this.specialItems.forEach(item => item.draw());
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
                this.stopGrassDrop();
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

    resetGrassArray() {
        this.grass = [];
    }

    resetSpecialItemsArray() {
        this.specialItems = [];
    }

    resetParticles() {
        this.particles1 = [];
        this.particles2 = [];
    }

    updateScoreDisplay() {
        this.basket.updateScore(this.player1.score + this.player2.score, this.level.targetScores);
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