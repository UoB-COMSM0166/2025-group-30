class PauseScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        // Button dimensions and spacing
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonSpacing = 30;

        this.buttons = [
            {
                label: "Continue",
                x: baseWidth/2 ,
                y: baseHeight/2,
                action: () => {
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Restart",
                x: baseWidth/2,
                y: baseHeight/2 + this.buttonHeight + this.buttonSpacing,
                action: () => {
                    this.gameScreen.restart();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: baseWidth/2,
                y: baseHeight/2 + (this.buttonHeight + this.buttonSpacing)*2,
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
        push();
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
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth/2 
                && window.mouseXGame <= button.x + this.buttonWidth/2 
                && window.mouseYGame >= button.y - this.buttonHeight/2 
                && window.mouseYGame <= button.y + this.buttonHeight/2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight, 10);

            // Draw button text
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }

    // mouse clicks on buttons
    // mousePressed() {
    //     for (let button of this.buttons) {
    //         // 计算按钮的点击区域
    //         let buttonTop = button.y - this.buttonHeight/2;
    //         let buttonBottom = button.y + this.buttonHeight/2;
    //         let buttonLeft = button.x;
    //         let buttonRight = button.x + this.buttonWidth;

    //         // 检查鼠标是否在按钮区域内
    //         if (window.mouseXGame > buttonLeft && 
    //             window.mouseXGame < buttonRight && 
    //             window.mouseYGame > buttonTop && 
    //             window.mouseYGame < buttonBottom) {
                
    //             button.action();
    //             return; // 防止点击多个按钮
    //         }
    //     }
    // }
}
