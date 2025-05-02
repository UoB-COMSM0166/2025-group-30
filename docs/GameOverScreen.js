class GameOverScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 100;
        this.buttonHeight = 40;

        this.farmerImage = null;
        this.loadFarmerImage();

        this.boardImage = loadImage('assets/board2.webp');

        this.resetAnimationState();

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
                label: "Restart",
                x: baseWidth / 4 * 3,
                y: baseHeight / 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.gameScreen.restartFromCurrentLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            }
        ];
    }

    resetAnimationState() {
        this.alpha = 0;
        this.fadeSpeed = 5;
    }

    onActivate() {
        this.resetAnimationState();
    }

    loadFarmerImage() {
        loadImage('./assets/Farmer Cry.gif', img => {
            this.farmerImage = img;
        });
    }

    display() {
        this.gameScreen.display();
        rectMode(CORNER);

        this.alpha = min(255, this.alpha + this.fadeSpeed);

        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        const panelWidth = 300;
        const panelHeight = 250;
        imageMode(CENTER);
        tint(255, this.alpha);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, panelWidth, panelHeight);

        fill(0, this.alpha);
        textFont('Comic Sans MS');
        textStyle(BOLD);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("GAME OVER", baseWidth / 2, baseHeight / 2 - 85);

        if (this.farmerImage) {
            const imageSize = 160;
            imageMode(CENTER);
            image(this.farmerImage, baseWidth / 2, baseHeight / 2 - 30, imageSize, imageSize);
        }

        textSize(18);
        if (this.gameScreen === this.screenManager.single) {
            text(`Your Score: ${this.gameScreen.player.score}`, baseWidth / 2, baseHeight / 2 + 35);
        } else if (this.gameScreen === this.screenManager.coop) {
            text(`Your Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth / 2, baseHeight / 2 + 35);
        }

        text(`Target Score: ${this.gameScreen.level.targetScores}`, baseWidth / 2, baseHeight / 2 + 75);

        for (let button of this.buttons) {
            rectMode(CENTER);

            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);

            if (isHovered) {
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

        noTint();
        textFont('sans-serif');
    }
}
