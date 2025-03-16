class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 200;
        this.buttonHeight = 40;
        
        this.buttons = [
            {
                label: "Single Player",
                x : baseWidth / 2, 
                y : baseHeight / 3,
                action: () => this.screenManager.changeScreen(this.screenManager.singleHelpScreen) //go to single help screen
            },
            {
                label: "Co-op Mode",
                x : baseWidth / 2, 
                y : baseHeight / 2,
                action: () => this.screenManager.changeScreen(this.screenManager.coopHelpScreen) //go to coop help screen
            },
            {
                label: "PvP Mode",
                x : baseWidth / 2, 
                y : baseHeight / 3 * 2,
                action: () => this.screenManager.changeScreen(this.screenManager.pvpHelpScreen) //go to pvp help screen
            },
            {
                label: "Back",
                x : baseWidth / 2, 
                y : baseHeight * 5/6,
                action: () => this.screenManager.changeScreen(this.screenManager.homeScreen) //go to settings screen
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
            rectMode(CENTER);

            //button background
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
            
            // button text
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }

    
}