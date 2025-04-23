class AccomplishScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        this.buttons = [
            {
                label: "Back to Menu to Try a Different Mode",
                x: baseWidth / 2,
                y: baseHeight / 2 + 60,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            }
        ];
    }

    display() {
        this.gameScreen.display();

        // 半透明背景
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // 绘制白色悬浮窗
        fill(255);
        rectMode(CENTER);
        rect(baseWidth / 2, baseHeight / 2, 300, 250, 10);

        // 显示通关信息
        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Congratulations!", baseWidth / 2, baseHeight / 2 - 70);

        textSize(24);
        if (this.gameScreen === this.screenManager.single) {
            text(`Final Score: ${this.gameScreen.player.score}`, baseWidth / 2, baseHeight / 2 - 20);
        } else if (this.gameScreen === this.screenManager.coop) {
            text(`Final Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth / 2, baseHeight / 2 - 20);
        }

        // 显示按钮
        for (let button of this.buttons) {
            rectMode(CENTER);
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

    // mousePressed() {
    //     for (let button of this.buttons) {
    //         if (window.mouseXGame >= button.x - button.buttonWidth / 2
    //             && window.mouseXGame <= button.x + button.buttonWidth / 2
    //             && window.mouseYGame >= button.y - button.buttonHeight / 2
    //             && window.mouseYGame <= button.y + button.buttonHeight / 2) {
    //             button.action();
    //             break;
    //         }
    //     }
    // }
} 