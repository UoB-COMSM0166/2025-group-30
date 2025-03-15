class SingleHelpScreen extends Screen {
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
                x: baseWidth / 4 * 3, 
                y: baseHeight / 5 * 4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.screenManager.single.reset(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.single); 
                }
            }
        ];

        this.title = "Single Player Instructions";
        this.instructions = [
            "Use LEFT/RIGHT arrow keys to move",
            "Press SPACE to place hay in the basket",
            "You can stack up to 5 hay blocks",
            "Don't let hay blocks fall to the ground"
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

    mousePressed() { //button clicking logic
        for (let button of this.buttons) {
            // 计算按钮的点击区域
            let buttonTop = button.y - this.buttonHeight/2;
            let buttonBottom = button.y + this.buttonHeight/2;
            let buttonLeft = button.x;
            let buttonRight = button.x + this.buttonWidth;

            // 检查鼠标是否在按钮区域内
            if (window.mouseXGame > buttonLeft && 
                window.mouseXGame < buttonRight && 
                window.mouseYGame > buttonTop && 
                window.mouseYGame < buttonBottom) {
                
                button.action();
                return; // 防止点击多个按钮
            }
        }
    }
}