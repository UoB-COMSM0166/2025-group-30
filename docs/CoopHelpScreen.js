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
                x: baseWidth / 4 , 
                y: baseHeight / 5 * 4,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Start",
                x: baseWidth/4*3, 
                y: baseHeight/5*4,
                action: () => {
                    this.screenManager.coop.resetToLevel1(); //reset single to level 1
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