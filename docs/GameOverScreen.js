class GameOverScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 100;
        this.buttonHeight = 40;

        this.farmerImage = null;
        this.loadFarmerImage();

        this.boardImage = loadImage('assets/board2.webp');

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

    loadFarmerImage() {
        loadImage('./assets/Farmer Cry.gif', img => {
            this.farmerImage = img;
        });
    }

    display() {
        this.gameScreen.display();
        rectMode(CORNER);

        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        const panelWidth = 300;
        const panelHeight = 250;
        imageMode(CENTER);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, panelWidth, panelHeight);

        fill(0);
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

            if (isHovered) {
                fill(255, 210, 160);
            } else {
                fill(243, 186, 125);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            fill(147, 75, 43);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        textFont('sans-serif');
    }
}
