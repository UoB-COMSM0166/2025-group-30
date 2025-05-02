class PvpLevelUpScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.boardImage = loadImage('assets/board2.webp');
        this.farmerTieImage = loadImage('assets/Farmer tie.gif');

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // 初始化动画状态
        this.resetAnimationState();

        // Buttons for navigating
        this.buttons = [
            {
                label: "Next Level",
                x: baseWidth / 4 * 3,
                y: baseHeight / 5 * 4,
                action: () => {
                    this.startFadeOut();
                }
            },
            {
                label: "Home",
                x: baseWidth / 4,
                y: baseHeight / 5 * 4,
                action: () => {
                    this.startFadeOut();
                }
            }
        ];
    }

    // 重置动画状态
    resetAnimationState() {
        this.alpha = 0;
        this.fadeIn = true;
        this.fadeSpeed = 5;
        this.isTransitioning = false;
    }

    // 开始淡出动画
    startFadeOut() {
        this.fadeIn = false;
        this.isTransitioning = true;
    }

    // 当屏幕被激活时调用
    onActivate() {
        // 强制重置所有状态
        this.alpha = 0;
        this.fadeIn = true;
        this.isTransitioning = false;
    }

    display() {
        this.gameScreen.display();

        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        // 更新动画透明度
        if (this.fadeIn) {
            this.alpha = min(255, this.alpha + this.fadeSpeed);
        } else {
            this.alpha = max(0, this.alpha - this.fadeSpeed);
            // 当淡出完成时
            if (this.alpha === 0 && this.isTransitioning) {
                this.isTransitioning = false;
                if (this.buttons[0].action === this.buttons[0].action) {
                    this.gameScreen.startNextLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                } else {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            }
        }

        // 使用 board2.webp 作为背景框
        tint(255, this.alpha);
        imageMode(CENTER);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, 300, 250);
        image(this.farmerTieImage, baseWidth / 2, baseHeight / 2 - 50, 100, 100);
        noTint();

        // 设置全局文本样式
        textFont('Comic Sans MS');
        textStyle(BOLD);

        fill(0, this.alpha);
        textSize(32);
        textAlign(CENTER, CENTER);
        if (this.gameScreen.player1.score > this.gameScreen.player2.score) {
            text("Player 1 Wins!", baseWidth / 2, baseHeight / 2 + 20);
        } else if (this.gameScreen.player1.score < this.gameScreen.player2.score) {
            text("Player 2 Wins!", baseWidth / 2, baseHeight / 2 + 20);
        } else {
            text("It's a Tie!", baseWidth / 2, baseHeight / 2 + 20);
        }

        // Display buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth / 2
                && window.mouseXGame <= button.x + this.buttonWidth / 2
                && window.mouseYGame >= button.y - this.buttonHeight / 2
                && window.mouseYGame <= button.y + this.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);

            if (isHovered || isFocused) {
                fill(255, 210, 160, this.alpha);
            } else {
                fill(243, 186, 125, this.alpha);
            }
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight, 10);

            fill(147, 75, 43, this.alpha);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        // 重置文本样式
        textStyle(NORMAL);
        textFont('sans-serif');
    }
}
