class GameOverScreen extends Screen { 
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;

        this.buttonWidth = 100;
        this.buttonHeight = 40;
        
        this.buttons = [
            {
                label: "Home",
                x: baseWidth / 4 - this.buttonWidth/2,
                y: baseHeight / 5 * 4,
                color: "rgb(255, 0, 0)", 
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            },
            {
                label: "Restart",
                x: baseWidth / 4 * 3 - this.buttonWidth/2,
                y: baseHeight / 5 * 4,
                color: "rgb(0, 200, 0)", 
                action: () => {
                    this.gameScreen.restart();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            }
        ];
    }

    display() {
        this.gameScreen.display();
        
        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, baseWidth, baseHeight);

        // 游戏结束弹窗
        const panelWidth = 300;
        const panelHeight = 250;
        fill(255);
        rect(baseWidth/ 2 - panelWidth/2, baseHeight/ 2 - panelHeight/2, panelWidth, panelHeight);
        
        // 文本内容
        fill(0);
        textSize(18);
        textAlign(CENTER, CENTER);
        text("Game Over", baseWidth / 2, baseHeight / 2 - 70); // Game over title
        
        textSize(14);
        if (this.gameScreen === this.screenManager.single){
            text(`Your Score: ${this.gameScreen.player.score}`, baseWidth / 2, baseHeight / 2 + 20);
        } else if (this.gameScreen === this.screenManager.coop){
            text(`Your Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth / 2, baseHeight / 2 + 20);
        }
       
        text(`Target Score: ${this.gameScreen.targetScores}`, baseWidth / 2, baseHeight / 2 + 40);

        // Display button options
        for (let button of this.buttons) {
            fill(button.color);
            rect(button.x, button.y - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
            
            fill(0);
            textSize(16);
            text(button.label, button.x + this.buttonWidth/2, button.y);
        }
    }

}
