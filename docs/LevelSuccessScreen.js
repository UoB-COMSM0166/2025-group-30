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
                x: baseWidth/ 4 * 3,
                y: baseHeight/ 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.gameScreen.setNextLevel();
                    this.screenManager.changeScreen(this.gameScreen.targetScoreScreen); // startGrassDropAndLevelTimer will be called in targetScoreScreen
                }
            },
            {
                label: "Home",
                x: baseWidth/ 4 ,
                y: baseHeight/ 5 * 4,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.gameScreen.resetStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            }
        ];
    }

    // Display the Level Success screen
    display() { // Update the content of the LevelSuccessScreen
        this.gameScreen.display();
        
        // 半透明背景
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // 绘制白色悬浮窗
        fill(255);
        rectMode(CENTER);
        rect(baseWidth/2, baseHeight/2, 300, 250, 10);

        // 显示关卡完成信息
        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level} Complete!`, baseWidth/2, baseHeight/2 - 70);
       
        // 显示分数信息
        textSize(24);
        if (this.gameScreen === this.screenManager.single){
            text(`Score: ${this.gameScreen.player.score}`, baseWidth/2, baseHeight/2 - 20);
        } else if (this.gameScreen === this.screenManager.coop){
            text(`Score: ${this.gameScreen.player1.score + this.gameScreen.player2.score}`, baseWidth/2, baseHeight/2 - 20);
        }

        // 显示目标分数
        textSize(24);
        text(`Target: ${this.gameScreen.targetScores}`, baseWidth/2, baseHeight/2 + 20);

        // 显示按钮
        for (let button of this.buttons) {
            rectMode(CENTER);

            // 检查鼠标是否悬停在按钮上
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
            
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
}
