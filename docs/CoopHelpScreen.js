class CoopHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        
        this.buttonWidth = 200;
        this.buttonHeight = 40;
        this.buttonWidth = 100;
        this.buttonHeight = 40;

        this.buttons = [
            {
                label: "Back",
                x: baseWidth / 4 - 50, 
                y: baseHeight / 5 * 4,
                color: "rgb(255, 165, 0)",
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Start",
                x: baseWidth/4*3, 
                y: baseHeight/5*4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.screenManager.coop.reset(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.coop); 
                }
            }
        ];
        this.title = "PvP Mode Instructions";
        this.instructions = [
            "Player 1: Use A/D keys to move, Player 2: Use LEFT/RIGHT",
            "Player 1: Press SPACE to place hay, Player 2: Press ENTER",
            "Compete to collect more hay blocks",
            "The player with higher score at the end wins"
        ];
    }

    display() {
        background(230);
        textAlign(CENTER, CENTER);

        // 显示标题
        textSize(32);
        fill(0);
        text(this.title, baseWidth/2, baseHeight/4);

        // 显示说明文本
        const instructionsStartY = baseHeight/2 - 60;
        const lineHeight = 40;
        textSize(20);
        for (let i = 0; i < this.instructions.length; i++) {
            text(this.instructions[i], baseWidth/2, instructionsStartY + (i * lineHeight));
        }
        
        for (let button of this.buttons){
            fill(button.color);
            rect(button.x, button.y -20, this.buttonWidth, this.buttonHeight);
            fill(0);
            textSize(16);
            text(button.label, button.x+50, button.y);
        }
    }

}