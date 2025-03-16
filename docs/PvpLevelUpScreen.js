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
                x: baseWidth/ 4 * 3 ,
                y: baseHeight/ 5 * 4,
                action: () => {
                    this.gameScreen.startNextLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: baseWidth/ 4,
                y: baseHeight/ 5 * 4,
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
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight,10);
            
            fill(0);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
}
