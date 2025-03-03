class LevelSuccessScreen extends Screen { 
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        // Buttons for navigating
        this.buttons = [
            {
                label: "Next Level",
                x: width / 4 * 3 - 50,
                y: height / 5 * 4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.gameScreen.startNextLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: width / 4 - 50,
                y: height / 5 * 4,
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
        rect(0, 0, width, height);

        fill(255);
        rect(width / 2 - 150, height / 2 - 100, 300, 250);  // Display box for message
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level} Complete!`, width / 2, height / 2 - 70);
        textSize(16);

        if (this.gameScreen === this.screenManager.single){
            text(`Score: ${this.gameScreen.player.score}`, width / 2, height / 2);
        } else if (this.gameScreen === this.screenManager.coop){
            text(`Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, width / 2, height / 2);
        }

        text(`Target: ${this.gameScreen.targetScores}`, width / 2, height / 2 + 20);

        // Display buttons
        for (let button of this.buttons) {
            fill(button.color);
            let buttonWidth = 120;
            let buttonHeight = 40;
            rect(button.x, button.y - 20, buttonWidth, buttonHeight);
            fill(0);
            textSize(16);
            text(button.label, button.x + 60, button.y);
        }
    }

    // mouse clicks on buttons
    mousePressed() {
        let buttonWidth = 120;
        let buttonHeight = 40;
        for (let button of this.buttons) {
            if (mouseY > button.y - 20 &&
                mouseY < button.y - 20 + buttonHeight &&
                mouseX > button.x &&
                mouseX < button.x + buttonWidth
            ) button.action()
        }
    }
}
