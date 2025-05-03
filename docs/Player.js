class Player {
    constructor(position = "middle") {
        this.position = position; //used only for pvp mode

        this.w = 100;
        this.h = 150;

        if (position === "middle") this.x = (baseWidth - this.w) / 2;
        else if (position === "left" || position === "pvpLeft") this.x = (baseWidth - this.w) / 4;
        else if (position === "right" || position === "pvpRight") this.x = (baseWidth - this.w) / 4 * 3;

        this.y = baseHeight - 150; //stay the same
        this.score = 0;

        this.velocity = 0;
        this.maxSpeed = 10;
        this.acceleration = 0.85;
        this.decelerationFactor = 0.8;
        this.speedReductionPerHay = 0.1; // Speed reduction per hay caught
        this.dir = 0;

        this.stack = [];  //visible caught hay
        this.maxStack = 5;

        this.barrel = null;

        this.flash = new Flash(0);

        this.playerImage = null;
        this.loadPlayerImage();

        this.speedBoot = null;
        this.proteinShaker = null;

        this.soundManager = null; 

    }

    setSoundManager(soundManager) {
        this.soundManager = soundManager;
    }

    reset() {
        if (this.position === "middle") this.x = (baseWidth - this.w) / 2;
        else if (this.position === "left" || this.position === "pvpLeft") this.x = (baseWidth - this.w) / 4;
        else if (this.position === "right" || this.position === "pvpRight") this.x = (baseWidth - this.w) / 4 * 3;

        this.score = 0;

        this.velocity = 0;
        this.dir = 0;

        this.stack = [];
        this.flash.setFlashDuration(0);

        this.speedBoot = null;
        this.proteinShaker = null;
    }

    movePlayerWithCaughtHay() {
        if (this.flash.getFlashDuration() > 0) { return; }

        const oldX = this.x;

        // Calculate actual max speed based on current hay stack
        let currentMaxSpeed = this.maxSpeed * (1 - this.stack.length * this.speedReductionPerHay);
        currentMaxSpeed = Math.max(currentMaxSpeed, this.maxSpeed * 0.3); // Set minimum speed to 30% of max speed

        if (this.dir !== 0) {
            if (Math.sign(this.dir) !== Math.sign(this.velocity)  //player changes direction
                && abs(this.velocity) > 0.1) {
                this.velocity = this.dir * (this.acceleration + abs(this.velocity) * 0.5);
            } else { //continue moving in the same direction
                this.velocity += this.dir * this.acceleration;
                this.velocity = constrain(this.velocity, -currentMaxSpeed, currentMaxSpeed);
            }
        } else {
            this.velocity *= this.decelerationFactor;
            if (abs(this.velocity) < 0.1) this.velocity = 0;
        }

        // Limit movement range
        if (this.position === "pvpLeft") this.x = constrain(this.x, 0, baseWidth / 2 - this.w);
        else if (this.position === "pvpRight") this.x = constrain(this.x, baseWidth / 2, baseWidth - this.w);
        else this.x = constrain(this.x, 0, baseWidth - this.w);

        // Calculate x-axis movement distance and update stacked hay positions
        this.x += this.velocity;
        const dx = this.x - oldX;
        for (let hay of this.stack) {
            hay.x += dx;
        }
    }

    drawPlayerWithCaughtHay() { //draw player with caught hay  
        rectMode(CORNER);
        this.flash.update();
        if (!this.flash.playerIsVisible) return;//player with hay is not shown if flash is running 

        //draw caught hay
        for (let hay of this.stack) {
            hay.draw();
        }

        // draw player image
        image(this.playerImage, this.x, this.y, this.w, this.h);
    }

    catches(hay) { //return true if hay is caught, false otherwise
        const yGap = 3; // Use consistent gap for all hay blocks

        // If it's the first block, check if it's in contact with the platform
        if (this.stack.length === 0) {
            // Calculate overlap with player platform
            const overlapLeft = Math.max(this.x, hay.x);
            const overlapRight = Math.min(this.x + this.w, hay.x + hay.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * hay.w; // 20% of hay width

            if (hay.y + hay.h >= this.y &&
                hay.y + hay.h <= this.y + yGap + 2 && // if the falling hay is within the gap range
                overlapWidth >= minRequiredOverlap) {

                // Smoothly position the hay
                hay.y = this.y - hay.h + yGap;
                hay.setPerfectStack(false); // the first hay is not a perfect stack
                this.stack.push(hay);

                // Play collect hay sound effect
                if (this.soundManager) {
                    console.log('Playing collectHay sound');
                    this.soundManager.playSound('collectHay');
                } else {
                    console.error('SoundManager not set');
                }

                // Check if adding this hay exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                    // Play ouch sound effect
                    if (this.soundManager) {
                        console.log('Playing ouch sound');
                        this.soundManager.playSound('ouch');
                    }
                }
                return true;
            }
        } else {
            // Get the top block
            const topHay = this.stack[this.stack.length - 1];

            // Calculate overlap with top hay in stack
            const overlapLeft = Math.max(topHay.x, hay.x);
            const overlapRight = Math.min(topHay.x + topHay.w, hay.x + hay.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * hay.w; // 20% of hay width

            // if the falling hay is within the gap range of the top hay
            const isVerticalContact = ((hay.y + hay.h) >= topHay.y) &&
                ((hay.y + hay.h) <= topHay.y + yGap + 2);

            if (overlapWidth >= minRequiredOverlap && isVerticalContact) {
                // Position the new hay block directly on top of the previous one with the gap
                hay.y = topHay.y - hay.h + yGap;
                this.checkPerfectStack(); //check if the new hay is a perfect stack
                this.stack.push(hay);

                // Play collect hay sound effect
                if (this.soundManager) {
                    console.log('Playing collectHay sound');
                    this.soundManager.playSound('collectHay');
                } else {
                    console.error('SoundManager not set');
                }

                // Check if adding this hay exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                    // Play ouch sound effect
                    if (this.soundManager) {
                        console.log('Playing ouch sound');
                        this.soundManager.playSound('ouch');
                    }
                }
                return true;
            }
        }
        return false;
    }

    checkPerfectStack() {
        if (this.stack.length < 2) return false;

        const minOverlapPercentage = 0.9; // 90% overlap required for "perfect" alignment

        const currentHay = this.stack[this.stack.length - 1];
        const hayBelow = this.stack[this.stack.length - 2];

        if (currentHay.perfectStack != null) { //hay is checked
            return false;
        }

        // Calculate overlap
        const overlapLeft = Math.max(currentHay.x, hayBelow.x);
        const overlapRight = Math.min(currentHay.x + currentHay.w, hayBelow.x + hayBelow.w);
        const overlapWidth = Math.max(0, overlapRight - overlapLeft);

        // Calculate overlap percentage relative to hay width
        const overlapPercentage = overlapWidth / currentHay.w;

        if (overlapPercentage < minOverlapPercentage) {
            currentHay.setPerfectStack(false);
            return false;
        }
        currentHay.setPerfectStack(true);
        return true;
    }

    emptyToBarrel() { //empty hay to the barrel
        if (this.stack.length === 0) return;

        // Calculate distance between player and barrel
        let playerCenter = this.x + this.w / 2;
        let barrelCenter = this.barrel.x + this.barrel.w / 2;
        let distance = abs(playerCenter - barrelCenter);

        // Set maximum distance for placing hay
        let maxDistance = 150; // This value can be adjusted as needed

        // Check if player is within reasonable range
        if (distance <= maxDistance) {
            this.score += this.stack.length;
            // Play set hay sound effect
            if (this.soundManager) {
                console.log('Playing setHay sound');
                this.soundManager.playSound('setHay');
            } else {
                console.error('SoundManager not set');
            }
            this.stack = [];
        }
    }

    loadPlayerImage() {
        if (this.position === "right" || this.position === "pvpRight") {
            this.playerImage = loadImage("assets/player2.webp");
        } else {
            this.playerImage = loadImage("assets/player1.webp");
        }
    }
}