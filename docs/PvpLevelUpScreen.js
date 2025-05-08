class PvpLevelUpScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.boardImage = loadImage('assets/board2.webp');
        this.farmerTieImage = loadImage('assets/Farmer tie.gif');
        this.lastClickedButton = null;

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Initialize animation state
        this.resetAnimationState();

        // Buttons for navigating
        this.buttons = [
            {
                label: "Menu",
                x: baseWidth / 4,
                y: baseHeight / 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.lastClickedButton = this.buttons[1];
                    this.startFadeOut();
                }
            },
            {
                label: "Next Level",
                x: baseWidth / 4 * 3,
                y: baseHeight / 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.lastClickedButton = this.buttons[0];
                    this.startFadeOut();
                }
            }
        ];
    }

    // Reset animation state
    resetAnimationState() {
        this.alpha = 0;
        this.fadeIn = true;
        this.fadeSpeed = 15;
        this.isTransitioning = false;
    }

    // Start fade out animation
    startFadeOut() {
        this.fadeIn = false;
        this.isTransitioning = true;
    }

    // Called when screen is activated
    resetScreenState() {
        // Force reset all states
        this.alpha = 0;
        this.fadeIn = true;
        this.isTransitioning = false;
    }

    display() {
        this.gameScreen.display();

        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        if (this.fadeIn) {
            this.alpha = min(255, this.alpha + this.fadeSpeed);
        } else {
            this.alpha = max(0, this.alpha - this.fadeSpeed);

            if (this.alpha === 0 && this.isTransitioning) {
                this.isTransitioning = false;
                if (this.lastClickedButton === this.buttons[0]) {
                    this.resetAnimationState();
                    this.gameScreen.startNextLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                    /* restart timer and drop
                    this.gameScreen.startLevelTimer();
                    this.gameScreen.startHayDrop();
                    this.gameScreen.startSpecialItemDrop(); */
                } else {
                    this.resetAnimationState();
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.menuScreen);
                }
            }
        }

        tint(255, this.alpha);
        imageMode(CENTER);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, 300, 250);
        image(this.farmerTieImage, baseWidth / 2, baseHeight / 2 - 50, 100, 100);
        noTint();

        textFont('Comic Sans MS');
        textStyle(BOLD);

        fill(0, this.alpha);
        textSize(32);
        textAlign(CENTER, CENTER);

        // display current result
        if (this.gameScreen.player1.score > this.gameScreen.player2.score) {
            text("Player 1 wins!", baseWidth / 2, baseHeight / 2 + 20);
        } else if (this.gameScreen.player1.score < this.gameScreen.player2.score) {
            text("Player 2 wins!", baseWidth / 2, baseHeight / 2 + 20);
        } else {
            text("It's a Tie!", baseWidth / 2, baseHeight / 2 + 20);
        }

        // display current score with updated values
        textSize(24);
        // get the latest score
        const player1Wins = this.gameScreen.player1.score > this.gameScreen.player2.score ?
            this.gameScreen.player1Wins : this.gameScreen.player1Wins;
        const player2Wins = this.gameScreen.player2.score > this.gameScreen.player1.score ?
            this.gameScreen.player2Wins : this.gameScreen.player2Wins;
        text(`Current score: ${player1Wins} - ${player2Wins}`, baseWidth / 2, baseHeight / 2 + 60);

        // Display buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);

            if (isHovered || isFocused) {
                fill(255, 210, 160, this.alpha);
            } else {
                fill(243, 186, 125, this.alpha);
            }
            if (isFocused) {
                stroke(14, 105, 218);
                strokeWeight(4);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            noStroke();
            fill(147, 75, 43, this.alpha);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        // Reset text style
        textStyle(NORMAL);
        textFont('sans-serif');
    }
}
