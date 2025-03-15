class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 200;
        this.buttonHeight = 40;
        
        this.buttons = [
            {
                label: "Single player",
                x : baseWidth / 2 - this.buttonWidth / 2, 
                y : baseHeight / 3,
                action: () => this.screenManager.changeScreen(this.screenManager.singleHelpScreen) //go to single help screen
            },
            {
                label: "Co-op Mode",
                x : baseWidth / 2 - this.buttonWidth / 2, 
                y : baseHeight / 2,
                action: () => this.screenManager.changeScreen(this.screenManager.coopHelpScreen) //go to coop help screen
            },
            {
                label: "PvP Mode",
                x : baseWidth / 2 - this.buttonWidth / 2, 
                y : baseHeight / 3 * 2,
                action: () => this.screenManager.changeScreen(this.screenManager.pvpHelpScreen) //go to pvp help screen
            }
        ];
    }

    display() {
        background(200);

        // 标题
        fill(0);
        textSize(25);
        textAlign(CENTER, CENTER);
        text("Select Game Mode", baseWidth / 2, baseHeight / 5);


        for (let button of this.buttons){
            // 按钮背景
            fill(100);
            rect(button.x, button.y - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
            
            // 按钮文字
            fill(255);
            textSize(20);
            text(button.label, baseWidth / 2, button.y);
        }
    }

    
}