class LevelSuccessScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 120;
        this.buttonHeight = 40;
        this.boardImage = loadImage('assets/board.webp');
        this.winImage = loadImage('assets/Farmer win.gif');

        // Initialize animation state
        this.resetAnimationState();

        // Buttons for navigating
        this.buttons = [
            {
                label: "Home",
                x: baseWidth / 4,
                y: baseHeight / 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            },
            {
                label: "Next Level",
                x: baseWidth / 4 * 3,
                y: baseHeight / 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.gameScreen.startNextLevel();
                    this.resetAnimationState();
                }
            }
        ];
    }

    // Reset animation state
    resetAnimationState() {
        this.alpha = 0;
        this.fadeSpeed = 5;
    }

    // Called when screen is activated
    onActivate() {
        // Reset animation state
        this.resetAnimationState();
    }

    display() {
        this.gameScreen.display();

        // Semi-transparent background
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // Update animation transparency
        this.alpha = min(255, this.alpha + this.fadeSpeed);

        tint(255, this.alpha);
        imageMode(CENTER);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, 300, 250);
        image(this.winImage, baseWidth / 2, baseHeight / 2 - 165, 200, 200);
        noTint();

        textFont('Comic Sans MS');
        textStyle(BOLD);

        // Display level completion message
        fill(0, this.alpha);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level.level} Complete!`, baseWidth / 2, baseHeight / 2 - 10);

        // Display score information
        textSize(24);
        if (this.gameScreen === this.screenManager.single) {
            text(`Score: ${this.gameScreen.player.score}`, baseWidth / 2, baseHeight / 2 + 40);
        } else if (this.gameScreen === this.screenManager.coop) {
            text(`Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth / 2, baseHeight / 2 + 40);
        }

        // Display target score
        textSize(24);
        text(`Target: ${this.gameScreen.level.targetScores}`, baseWidth / 2, baseHeight / 2 + 80);

        // Display buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);

            if (isHovered) {
                fill(254, 224, 173, this.alpha * 0.8); // Slightly transparent when hovered
            } else {
                fill(254, 224, 173, this.alpha);
            }
            if (isFocused) {
                stroke(14, 105, 218);
                strokeWeight(4);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            noStroke();
            fill(147, 75, 43, this.alpha);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        // Reset text style
        textStyle(NORMAL);
        textFont('sans-serif');
    }

    mousePressed() {
        // Check if button is clicked
        for (let button of this.buttons) {
            if (window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2) {
                button.action();
            }
        }
    }
}
