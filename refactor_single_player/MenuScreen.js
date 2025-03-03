class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);
        
        this.buttons = [
            {
                label: "Single player",
                x : width/2 - 100, 
                y : height/3,
                mode: "single",
                action: () => {
                    this.screenManager.helpScreen.setMode("single");
                    return this.screenManager.helpScreen;
                }
            },
            {
                label: "Co-op Mode",
                x : width/2 - 100, 
                y : height / 2,
                mode: "coop",
                action: () => {
                    this.screenManager.helpScreen.setMode("coop");
                    return this.screenManager.helpScreen;
                }
            },
            {
                label: "PvP Mode",
                x : width/2 - 100, 
                y : height / 3 * 2,
                mode: "pvp",
                action: () => {
                    this.screenManager.helpScreen.setMode("pvp");
                    return this.screenManager.helpScreen;
                }
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
        // 使用转换后的游戏坐标
        let mouseXGame = window.mouseXGame || mouseX;
        let mouseYGame = window.mouseYGame || mouseY;
        
        let buttonWidth = 200;
        let buttonHeight = 40;
        for (let button of this.buttons){
            if (mouseYGame > button.y -20 && 
                mouseYGame < button.y -20 + buttonHeight &&
                mouseXGame > button.x  && 
                mouseXGame < button.x + buttonWidth
            ) {
                this.screenManager.changeScreen(button.action());
            }
        }
    }
}