class AccomplishScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.buttonWidth = 120;
        this.buttonHeight = 40;
        this.boardImage = loadImage('assets/board2.webp');
        this.farmerWinImage = loadImage('assets/farmer win.gif');
        this.scale = 0;
        this.targetScale = 1;
        this.animationSpeed = 0.1;

        this.buttons = [
            {
                label: "Back to Menu",
                x: baseWidth / 2,
                y: baseHeight / 2 + 160,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            }
        ];
    }

    display() {
        this.gameScreen.display();

        // 更新动画
        this.scale = lerp(this.scale, this.targetScale, this.animationSpeed);

        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        push();
        translate(baseWidth / 2, baseHeight / 2);
        scale(this.scale);
        translate(-baseWidth / 2, -baseHeight / 2);

        imageMode(CENTER);
        image(this.farmerWinImage, baseWidth / 2, baseHeight / 2 - 150, 200, 200);

        imageMode(CENTER);
        image(this.boardImage, baseWidth / 2, baseHeight / 2, 300, 250);

        textFont('Comic Sans MS');
        textStyle(BOLD);

        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Congratulations!", baseWidth / 2, baseHeight / 2 - 85);
        
        textSize(24);
        text("You did it!", baseWidth / 2, baseHeight / 2 - 25);
        text("All levels conquered!", baseWidth / 2, baseHeight / 2 + 35);

        for (let button of this.buttons) {
            rectMode(CENTER);
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            if (isHovered) {
                fill(180, 126, 89);
            } else {
                fill(130, 76, 39);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            fill(255);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        textStyle(NORMAL);
        textFont('sans-serif');
        pop();
    }
} 