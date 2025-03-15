class LevelSuccessScreen extends Screen { 
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

        // pop up window
        const panelWidth = 300;
        const panelHeight = 250;
        fill(255);
        rect(baseWidth/ 2 - panelWidth/2, baseHeight/ 2 - panelHeight/2, panelWidth, panelHeight);  // Display box for message
      
        // text
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level} Complete!`, baseWidth/ 2, baseHeight/ 2 - 70);
       
        textSize(16);
        if (this.gameScreen === this.screenManager.single){
            text(`Score: ${this.gameScreen.player.score}`, baseWidth/ 2, baseHeight/ 2);
        } else if (this.gameScreen === this.screenManager.coop){
            text(`Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth/ 2, baseHeight/ 2);
        }

        text(`Target: ${this.gameScreen.targetScores}`, baseWidth/ 2, baseHeight/ 2 + 20);

        // Display buttons
        for (let button of this.buttons) {
            noStroke();
            fill(button.color);
            rect(button.x, button.y - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
            
            fill(0);
            textSize(16);
            text(button.label, button.x + this.buttonWidth/2, button.y);
        }
    }

}
