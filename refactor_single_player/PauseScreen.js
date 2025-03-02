class PauseScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttons = [
            {
                label: "Continue",
                x: width/2 - 60,
                y: height/2 - 20,
                color: "rgb(0, 255, 0)",
                action: () => {
                    this.gameScreen.paused = false;
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Restart",
                x: width/2 - 60,
                y: height/2 + 40,
                color: "rgb(255, 165, 0)",
                action: () => {
                    this.gameScreen.restart();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: width/2 - 60,
                y:height/2 + 100,
                color: "rgb(255, 0, 0)",
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            }
        ];
    }

    display() {
        this.gameScreen.display();
        
        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, width, height);

        // 菜单背景
        fill(220);
        rect(width/4, height/4, width/2, height/2);

        // Display buttons
        for (let button of this.buttons) {
            fill(button.color);
            let buttonWidth = 120;
            let buttonHeight = 40;
            rect(button.x, button.y, buttonWidth, buttonHeight);

            fill(0);
            textAlign(CENTER);
            textSize(20);
            text(button.label, button.x + 60, button.y+20);
        }
    }

    // mouse clicks on buttons
    mousePressed() {
        let buttonWidth = 120;
        let buttonHeight = 40;
        for (let button of this.buttons) {
            if (mouseY > button.y &&
                mouseY < button.y + buttonHeight &&
                mouseX > button.x &&
                mouseX < button.x + buttonWidth
            ) {
                button.action();
            }
        }
    }
}
