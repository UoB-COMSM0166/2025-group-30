class PauseScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonSpacing = 30;

        this.buttons = [
            {
                label: "Continue",
                x: baseWidth/2 ,
                y: baseHeight/2,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Restart",
                x: baseWidth/2,
                y: baseHeight/2 + 50 + this.buttonSpacing,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.gameScreen.restartFromCurrentLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: baseWidth/2,
                y: baseHeight/2 + (50 + this.buttonSpacing)*2,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            }
        ];
    }

    display() {
        this.gameScreen.display();

        // Draw semi-transparent overlay
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);


        // Draw pause menu title
        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("PAUSE", baseWidth/2, baseHeight/2 - 100);

        // Display buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            // Draw button text
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
}
