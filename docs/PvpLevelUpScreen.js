class PvpLevelUpScreen extends Screen { 
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Buttons for navigating
        this.buttons = [
            {
                label: "Next Level",
                x: baseWidth/ 4 * 3 - this.buttonWidth/2,
                y: baseHeight/ 5 * 4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.gameScreen.startNextLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: baseWidth/ 4 - this.buttonWidth/2,
                y: baseHeight/ 5 * 4,
                color: "rgb(255, 165, 0)",
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            }
        ];
    }

    // Display the Level Success screen
    display() { // Update the content of the LevelSuccessScreen
        this.gameScreen.display();
        
        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        fill(255);
        rect(baseWidth/ 2 - 150, baseHeight/ 2 - 100, 300, 250);  // Display box for message
        
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        if (this.gameScreen.player1.score > this.gameScreen.player2.score){
            text("Player 1 Wins!", baseWidth/ 2, baseHeight/ 2 - 10);
        } else if (this.gameScreen.player1.score <  this.gameScreen.player2.score){
            text("Player 2 Wins!", baseWidth/ 2, baseHeight/ 2 - 10);
        } else {
            text("It's a Tie!", baseWidth/ 2, baseHeight/ 2 - 10);
        }

        // Display buttons
        for (let button of this.buttons) {
            fill(button.color);
            rect(button.x, button.y - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
            
            fill(0);
            textSize(16);
            text(button.label, button.x + this.buttonWidth/2, button.y);
        }
    }

    // mouse clicks on buttons
    mousePressed() {
        for (let button of this.buttons) {
            // 计算按钮的点击区域
            let buttonTop = button.y - this.buttonHeight/2;
            let buttonBottom = button.y + this.buttonHeight/2;
            let buttonLeft = button.x;
            let buttonRight = button.x + this.buttonWidth;

            // 检查鼠标是否在按钮区域内
            if (window.mouseXGame > buttonLeft && 
                window.mouseXGame < buttonRight && 
                window.mouseYGame > buttonTop && 
                window.mouseYGame < buttonBottom) {
                
                button.action();
                return; // 防止点击多个按钮
            }
        }
    }
}
