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
        this.specialItems = []; //collection of special items (shovels, protein shakers, etc.)

        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second        
        this.specialItemDropInterval = null;

        this.particles = []; // Add particle array to handle the effects of perfect stack
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

        this.grass = []; //empty the grass piles

        setTimeout(() => {
            if (this.grassDropInterval === null) {
                let firstX = this.findSafePosition(100);
                this.grass.push(new Grass(firstX, 10));

                this.grassDropInterval = setInterval(() => {
                    if (this.player.flash.getFlashDuration() === 0
                        && this.screenManager.currentScreen === this) {
                        let newX = this.findSafePosition(100);
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

    startSpecialItemDrop() {
        //if (this.level.level === 1) return; //special items start from level 2
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }

        this.specialItems = []; //empty the special items array   

        this.specialItemDropInterval = setInterval(() => {
            if (this.player.flash.getFlashDuration() === 0
                && this.screenManager.currentScreen === this) {

                const minDistance = 100; // Minimum distance between grass and special items
                const newX = this.findSafePosition(minDistance);

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

    stopSpecialItemDrop() {
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
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

    checkPerfectStack() {
        if (this.player.checkPerfectStack()) {
            this.level.addTime(2);
            this.createPerfectStackEffects();
        }
    }

    createPerfectStackEffects() {
        // Get the position of the perfect stack
        const currentGrass = this.player.stack[this.player.stack.length - 1];
        const x = currentGrass.x + currentGrass.w / 2;
        const y = currentGrass.y + currentGrass.h / 2;

        // Create sparkles
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(x, y, 'sparkle'));
        }

        // Create "Perfect Stack!" text 
        this.particles.push(new Particle(x, y - 30, 'perfect_stack'));

        // Create "+2s" bonus text
        this.particles.push(new Particle(x, y - 60, 'bonus_time'));
    }

    drawFallingGrass() { //draw the grass
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].draw();
        }
    }

    updateSpecialItems() {
        //if (this.level.level === 1) {
        //     return;
        // }
        for (let i = this.specialItems.length - 1; i >= 0; i--) {
            const currentItem = this.specialItems[i];
            if (this.player.flash.getFlashDuration() === 0) {
                currentItem.fall();
            } //stop item fall if flashing is on or game is paused    

            if (currentItem.hits(this.player)) {
                currentItem.applyEffect(this.player, this);
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
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
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
        this.specialItems = [];
        this.particles = []; // Clear particles
        this.stopGrassDrop();
        this.stopSpecialItemDrop();
        this.stopLevelTimer();
    }

    restartFromLevel1() {
        this.level.resetToLevel1();
        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() { // restart from the current level
        this.clearStats();
        this.startGrassDrop();
        this.startSpecialItemDrop();
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

    findSafePosition(minDistance) {
        let newX;
        let isSafePosition;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            newX = random(200, baseWidth - 100);
            isSafePosition = true;

            // Check distance from all existing grass
            for (let grass of this.grass) {
                if (abs(grass.x - newX) < minDistance) {
                    isSafePosition = false;
                    break;
                }
            }

            // Check distance from all special items
            for (let item of this.specialItems) {
                if (abs(item.x - newX) < minDistance) {
                    isSafePosition = false;
                    break;
                }
            }

            attempts++;
            if (attempts >= maxAttempts) {
                // If we can't find a safe position after max attempts, 
                // just return the last generated position
                return newX;
            }
        } while (!isSafePosition);

        return newX;
    }
}