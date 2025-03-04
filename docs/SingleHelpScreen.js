class SingleHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        this.buttons = [
            {
                label: "Back",
                x: width / 4 - 50, 
                y: height / 5 * 4,
                color: "rgb(255, 165, 0)",
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Start",
                x: width/4*3, 
                y: height/5*4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.screenManager.single.reset(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.single); 
                }
            }
        ];
    }

    display() {
        background(200);
        fill(255);
        rect(width / 2 - 150, height / 2 - 100, 300, 250);
        fill(0);
        textSize(18);
        textAlign(CENTER,CENTER);
        text("Game Rules", width / 2, height / 2 - 70);
        textSize(14);
        text("◀︎: LEFT", width / 2, height / 2 - 40);
        text("▶︎: RIGHT", width / 2, height / 2 - 20);
        text("You can only catch up to 5 haystack", width / 2, height / 2);
        text("Move to basket & press SPACE to empty your pile", width / 2, height / 2+20);
        text("Press ESC to pause", width / 2, height / 2+40); 
        
        for (let button of this.buttons){
            fill(button.color);
            let buttonWidth = 100;
            let buttonHeight = 40;
            rect(button.x, button.y -20, buttonWidth, buttonHeight);
            fill(0);
            textSize(16);
            text(button.label, button.x+50, button.y);
        }
    }

    mousePressed() { //button clicking logic
        let buttonWidth = 100;
        let buttonHeight = 40;
        for (let button of this.buttons){
            if (mouseY > button.y -20 && 
                mouseY < button.y -20 + buttonHeight &&
                mouseX > button.x  && 
                mouseX < button.x + buttonWidth
            ) {
                button.action();
            }
        }
    }
}