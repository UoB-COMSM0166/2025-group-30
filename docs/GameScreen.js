class GameScreen extends Screen {
    constructor(screenManager, level, gameMode) {
        super(screenManager);
        this.backgroundImage = null;
        this.loadBackgroundImage();

        // Level related settings
        this.level = new Level(gameMode, level);

        // Screens
        this.pauseScreen = new PauseScreen(this.screenManager, this);

        // Game state
        this.grassDropInterval = null;
        this.levelTimerInterval = null;
        this.specialItemDropInterval = null;

        this.resetGrassArray();
        this.resetSpecialItemsArray();
        this.resetParticles();
    }

    display() {
        this.throwError('display must be implemented by subclasses');
    }

    startGrassDrop() {
        throw new Error('startGrassDrop must be implemented by subclasses');
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
    }

    startSpecialItemDrop() {
        throw new Error('startSpecialItemDrop must be implemented by subclasses');
    }

    stopSpecialItemDrop() {
        if (this.specialItemDropInterval) {
            clearInterval(this.specialItemDropInterval);
            this.specialItemDropInterval = null;
        }
    }

    updateFallingGrass() {
        throw new Error('updateFallingGrass must be implemented by subclasses');
    }

    drawFallingGrass() {
        throw new Error('drawFallingGrass must be implemented by subclasses');
    }

    checkEachPlayerPerfectStack(player, particles) {
        if (player.checkPerfectStack()) {
            this.level.addTime(2);
            this.createPerfectStackEffects(player, particles);
        }
    }

    createPerfectStackEffects(player, particles) {
        // Get the position of the perfect stack
        const currentGrass = player.stack[player.stack.length - 1];
        const x = currentGrass.x + currentGrass.w / 2;
        const y = currentGrass.y + currentGrass.h / 2;

        // Create sparkles
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(x, y, 'sparkle'));
        }

        // Create "Perfect Stack!" text
        particles.push(new Particle(x, y - 30, 'perfect_stack'));

        // Create "+2s" bonus text
        particles.push(new Particle(x, y - 60, 'bonus_time'));
    }

    updateSpecialItems() {
        throw new Error('updateSpecialItems must be implemented by subclasses');
    }

    updateEachPlayerSpecialItems(player, specialItemsArray) {
        if (this.level.level === 1) {
            return;
        }
        for (let i = specialItemsArray.length - 1; i >= 0; i--) {
            const currentItem = specialItemsArray[i];
            if (player.flash.getFlashDuration() === 0) {
                currentItem.fall();
            } //stop shovel fall if flashing is on or game is paused    

            if (currentItem.hits(player)) {
                currentItem.applyEffect(player, this);
                specialItemsArray.splice(i, 1);
            } else if (currentItem.isOffscreen()) {
                specialItemsArray.splice(i, 1);
            }
        }
    }

    drawSpecialItems() {
        throw new Error('drawSpecialItems must be implemented by subclasses');
    }

    updateParticles() {
        throw new Error('updateParticles must be implemented by subclasses');
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
        throw new Error('drawParticles must be implemented by subclasses');
    }

    startLevelTimer() {
        throw new Error('startLevelTimer must be implemented by subclasses');
    }

    stopLevelTimer() {
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
            this.levelTimerInterval = null;
        }
    }


    clearStats() {
        this.level.resetTimeLeft();

        this.resetPlayers();
        this.resetGrassArray();
        this.resetSpecialItemsArray();
        this.resetParticles();

        this.stopGrassDrop();
        this.stopSpecialItemDrop();
        this.stopLevelTimer();
    }

    resetPlayers() {
        throw new Error('resetPlayers must be implemented by subclasses');
    }

    resetGrassArray() {
        throw new Error('resetGrassArray must be implemented by subclasses');
    }

    resetSpecialItemsArray() {
        throw new Error('resetSpecialItemsArray must be implemented by subclasses');
    }

    resetParticles() {
        throw new Error('resetParticles must be implemented by subclasses');
    }

    restartFromLevel1() {
        this.level.resetToLevel1();
        this.restartFromCurrentLevel();
    }

    restartFromCurrentLevel() {
        this.clearStats();
        this.startGrassDrop();
        this.startSpecialItemDrop();
        this.startLevelTimer();
    }

    displayUI() {
        // Common UI elements
        fill(255);
        textSize(20);
        stroke(0);
        strokeWeight(2);
        textStyle(BOLD);

        // Display level
        textAlign(CENTER);
        text(`Level ${this.level.level}`, baseWidth / 2, 30);

        // Display time
        textAlign(LEFT);
        text(`Time: ${this.level.timeLeft}s`, 20, 30);
        noStroke();
        textStyle(NORMAL);

        // Call the game mode specific UI update
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        // To be overridden by subclasses
        throw new Error('updateScoreDisplay must be implemented by subclasses');
    }

    startNextLevel() {
        throw new Error('startNextLevel must be implemented by subclasses');
    }

    loadBackgroundImage() {
        this.backgroundImage = loadImage("assets/barn.webp");
    }

    findSafePosition(left, right, grassArray, specialItemsArray) {
        const minDistance = 50;
        let newX;
        let isSafePosition;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            newX = random(left, right);
            isSafePosition = true;

            // Check distance from all existing grass
            for (let grass of grassArray) {
                if (abs(grass.x - newX) < minDistance) {
                    isSafePosition = false;
                    break;
                }
            }

            // Check distance from all special items
            for (let item of specialItemsArray) {
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