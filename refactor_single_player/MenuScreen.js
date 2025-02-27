class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);
        
        this.buttons = [
            {
                label: "Single player",
                x : width/2 - 100, 
                y : height/3,
                screen : this.screenManager.singleHelpScreen,
                action: () => this.screenManager.singleHelpScreen //go to single help screen
            },
            {
                label: "Co-op Mode",
                x : width/2 - 100, 
                y : height / 2,
                screen: this.screenManager.coopHelpScreen,
                action: () => this.screenManager.coopHelpScreen //go to coop help screen
            },
            {
                label: "PvP Mode",
                x : width/2 - 100, 
                y : height / 3 * 2,
                screen: this.screenManager.pvpHelpScreen,
                action: () => this.screenManager.pvpHelpScreen //go to pvp help screen
            }
        ];
    }

    display() {
        background(200);
        textSize(25);
        textAlign(CENTER, CENTER);
        text("Select Game Mode", width / 2, height / 5);

        for (let button of this.buttons){
            fill(100);
            let buttonWidth = 200;
            let buttonHeight = 40;
            rect(button.x, button.y -20, buttonWidth, buttonHeight);
            fill(255);
            text(button.label, width/2, button.y);
        }
    }

    mousePressed() { //button clicking logic
        let buttonWidth = 200;
        let buttonHeight = 40;
        for (let button of this.buttons){
            if (mouseY > button.y -20 && 
                mouseY < button.y -20 + buttonHeight &&
                mouseX > button.x  && 
                mouseX < button.x + buttonWidth
            ) {
                this.screenManager.changeScreen(button.action());
            }
        }
    }
}