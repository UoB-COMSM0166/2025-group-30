class GameOverScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 100;
        this.buttonHeight = 40;

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

    display() {
        this.gameScreen.display();
        rectMode(CORNER);

        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        // 游戏结束弹窗
        const panelWidth = 300;
        const panelHeight = 250;
        fill(255);
        rect(baseWidth / 2 - panelWidth / 2, baseHeight / 2 - panelHeight / 2, panelWidth, panelHeight, 10);

        // 文本内容
        fill(0);
        textSize(18);
        textAlign(CENTER, CENTER);
        text("GAME OVER", baseWidth / 2, baseHeight / 2 - 70); // Game over title

        textSize(14);
        if (this.gameScreen === this.screenManager.single) {
            text(`Your Score: ${this.gameScreen.player.score}`, baseWidth / 2, baseHeight / 2 + 20);
        } else if (this.gameScreen === this.screenManager.coop) {
            text(`Your Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth / 2, baseHeight / 2 + 20);
        }

        text(`Target Score: ${this.gameScreen.level.targetScores}`, baseWidth / 2, baseHeight / 2 + 40);

        // Display button options
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            fill(0);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }

}
