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
        this.hayDropInterval = null;
        this.levelTimerInterval = null;
        this.specialItemDropInterval = null;

        this.resetHayArray();
        this.resetSpecialItemsArray();
        this.resetParticles();
    }

    display() {
        this.throwError('display must be implemented by subclasses');
    }

    startHayDrop() {
        throw new Error('startHayDrop must be implemented by subclasses');
    }

    stopHayDrop() {
        if (this.hayDropInterval) {
            clearInterval(this.hayDropInterval);
            this.hayDropInterval = null;
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

    updateFallingHay() {
        throw new Error('updateFallingHay must be implemented by subclasses');
    }

    drawFallingHay() {
        throw new Error('drawFallingHay must be implemented by subclasses');
    }

    checkEachPlayerPerfectStack(player, particles) {
        if (player.checkPerfectStack()) {
            this.level.addTime(2);
            this.createPerfectStackEffects(player, particles);
        }
    }

    createPerfectStackEffects(player, particles) {
        // Get the position of the perfect stack
        const currentHay = player.stack[player.stack.length - 1];
        const x = currentHay.x + currentHay.w / 2;
        const y = currentHay.y + currentHay.h / 2;

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
        this.resetHayArray();
        this.resetSpecialItemsArray();
        this.resetParticles();

        this.stopHayDrop();
        this.stopSpecialItemDrop();
        this.stopLevelTimer();
    }

    resetPlayers() {
        throw new Error('resetPlayers must be implemented by subclasses');
    }

    resetHayArray() {
        throw new Error('resetHayArray must be implemented by subclasses');
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
        this.startHayDrop();
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

    findSafePosition(left, right, hayArray, specialItemsArray) {
        const minDistance = 50;
        let newX;
        let isSafePosition;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            newX = random(left, right);
            isSafePosition = true;

            // Check distance from all existing hay
            for (let hay of hayArray) {
                if (abs(hay.x - newX) < minDistance) {
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

    displaySpecialItemTimers(player) {
        // 只在有速度buff时显示
        if (player.speedBoot) {
            const remainingTime = player.speedBoot.timeLeft;
            if (remainingTime > 0) {
                push();
                textSize(20);
                textAlign(LEFT);
                text(`Speed boost: ${remainingTime.toFixed(0)}s`, 20, 60);
                pop();
            }
        }

        // 只在有力量buff时显示
        if (player.proteinShaker) {
            const remainingTime = player.proteinShaker.timeLeft;
            if (remainingTime > 0) {
                push();
                fill(255);
                textSize(20);
                textAlign(LEFT);
                text(`Strength boost: ${remainingTime.toFixed(0)}s`, 20, 90);
                pop();
            }
        }
    }
} 