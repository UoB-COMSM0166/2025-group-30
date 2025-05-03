class Coop extends GameScreen {
    constructor(screenManager, level = 1) {
        super(screenManager, level, Level.GAME_MODES.COOP);

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

        // 重置字体
        textFont('sans-serif');
    }

    displayUI() {
        // Common UI elements
        fill(254, 224, 173); // 修改为指定的RGB颜色
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

        this.resetSpecialItemsArray();

        this.specialItemDropInterval = setInterval(() => {
            if ((this.player1.flash.getFlashDuration() === 0 ||
                this.player2.flash.getFlashDuration() === 0) &&
                this.screenManager.currentScreen === this) {

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

}