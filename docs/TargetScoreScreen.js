class TargetScoreScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.boardImage = loadImage('assets/board.webp');

        // Button settings
        this.buttonWidth = 120;
        this.buttonHeight = 40;
        this.confirmButton = {
            label: "Confirm",
            x: baseWidth / 2,
            y: baseHeight / 2 + 120,
            buttonWidth: this.buttonWidth,
            buttonHeight: this.buttonHeight,
            action: () => {
                this.startFadeOut();
            }
        };
        this.buttons = [this.confirmButton];

        // Initialize animation state
        this.resetAnimationState();
    }

    // Reset animation state
    resetAnimationState() {
        this.alpha = 0;
        this.fadeIn = true;
        this.fadeSpeed = 5;
        this.isTransitioning = false;
    }

    // Start fade out animation
    startFadeOut() {
        this.fadeIn = false;
        this.isTransitioning = true;
    }

    // Called when screen is activated
    onActivate() {
        // Force reset all states
        this.alpha = 0;
        this.fadeIn = true;
        this.isTransitioning = false;
    }

    keyPressed() {
        if (keyCode === RETURN) {
            this.confirmButton.action();
        }
    }

    display() {
        // Ensure that each display starts from the correct state
        if (this.alpha === 0 && !this.fadeIn && !this.isTransitioning) {
            this.resetAnimationState();
        }

        image(this.gameScreen.backgroundImage, 0, 0, baseWidth, baseHeight);

        // Draw different players based on game mode
        if (this.gameScreen === this.screenManager.single) {
            this.gameScreen.barrel.draw();
            this.gameScreen.player.drawPlayerWithCaughtHay();
        } else if (this.gameScreen === this.screenManager.coop) {
            this.gameScreen.barrel.draw();
            this.gameScreen.player1.drawPlayerWithCaughtHay();
            this.gameScreen.player2.drawPlayerWithCaughtHay();
        }

        // Draw semi-transparent background
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // Update animation transparency
        if (this.fadeIn) {
            this.alpha = min(255, this.alpha + this.fadeSpeed);
        } else {
            this.alpha = max(0, this.alpha - this.fadeSpeed);
            // When fade out is complete
            if (this.alpha === 0 && this.isTransitioning) {
                this.isTransitioning = false;
                this.screenManager.changeScreen(this.gameScreen);
                this.gameScreen.restartFromCurrentLevel();
            }
        }

        // Draw board.webp as dialog background
        tint(255, this.alpha);
        image(this.boardImage, baseWidth / 2 - 150, baseHeight / 2 - 100, 300, 200);
        noTint();

        // Set global text style
        textFont('Comic Sans MS');
        textStyle(BOLD);

        // Display current level
        fill(0, this.alpha);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level.level}`, baseWidth / 2, baseHeight / 2 - 8);

        // Draw target score text and value
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Target Score: " + this.gameScreen.level.targetScores, baseWidth / 2, baseHeight / 2 + 33);

        // Display item description
        textSize(13);
        let itemDescription = "";
        switch (this.gameScreen.level.level) {
            case 2:
                itemDescription = "Shovel alert! Dodge it or drop it all!";
                break;
            case 3:
                itemDescription = "Put on that speed boot and slide!";
                break;
            case 4:
                itemDescription = "Chug that protein shake and stack forever!";
                break;
            default:
        }
        textAlign(CENTER, CENTER);
        text(itemDescription, baseWidth / 2, baseHeight / 2 + 75);

        // Display confirm button
        rectMode(CENTER);

        // Check if mouse is hovering over button
        let isHovered = window.mouseXGame >= this.confirmButton.x - this.confirmButton.buttonWidth / 2
            && window.mouseXGame <= this.confirmButton.x + this.confirmButton.buttonWidth / 2
            && window.mouseYGame >= this.confirmButton.y - this.confirmButton.buttonHeight / 2
            && window.mouseYGame <= this.confirmButton.y + this.confirmButton.buttonHeight / 2;


        if (isHovered) {
            fill(180, 126, 89, this.alpha);
        } else {
            fill(130, 76, 39, this.alpha);
        }
        rect(this.confirmButton.x, this.confirmButton.y, this.confirmButton.buttonWidth, this.confirmButton.buttonHeight, 10);

        fill(255, this.alpha);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.confirmButton.label, this.confirmButton.x, this.confirmButton.y);

        // Reset text style
        textStyle(NORMAL);
        textFont('sans-serif');
    }
} 