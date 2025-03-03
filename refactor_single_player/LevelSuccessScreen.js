class LevelSuccessScreen extends Screen {
    constructor(screenManager, level = 1, score = 5, targetScores = 5) {
        super(screenManager);
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;

        // 统一按钮尺寸
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // 按钮位置将在display方法中更新
        this.buttons = [
            {
                label: "Next Level",
                width: this.buttonWidth,
                height: this.buttonHeight,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.screenManager.single.levelUp();
                    return this.screenManager.single;
                }
            },
            {
                label: "Menu",
                width: this.buttonWidth,
                height: this.buttonHeight,
                color: "rgb(255, 165, 0)",
                action: () => this.screenManager.menuScreen
            }
        ];
    }

    display() {
        background(200);
        
        // 使用固定的基准尺寸
        const baseWidth = 800;
        const baseHeight = 600;
        
        // 更新按钮位置
        this.buttons[0].x = baseWidth / 4 * 3 - this.buttonWidth/2;
        this.buttons[0].y = baseHeight / 5 * 4;
        
        this.buttons[1].x = baseWidth / 4 - this.buttonWidth/2;
        this.buttons[1].y = baseHeight / 5 * 4;
        
        // 成功界面的弹窗
        const panelWidth = 300;
        const panelHeight = 250;
        const panelX = baseWidth / 2 - panelWidth / 2;
        const panelY = baseHeight / 2 - panelHeight / 2;
        
        fill(255);
        rect(panelX, panelY, panelWidth, panelHeight);
        
        // 文本内容
        fill(0);
        textAlign(CENTER, CENTER);
        
        textSize(20);
        text(`Level ${this.level} Complete!`, baseWidth / 2, baseHeight / 2 - 70);
        
        textSize(16);
        text(`Score: ${this.score}`, baseWidth / 2, baseHeight / 2);
        text(`Target: ${this.targetScores}`, baseWidth / 2, baseHeight / 2 + 20);

        // 绘制按钮
        for (let button of this.buttons) {
            fill(button.color);
            rect(button.x, button.y - button.height/2, button.width, button.height);
            
            fill(0);
            textSize(16);
            text(button.label, button.x + button.width/2, button.y);
            
            // 调试 - 显示按钮边界
            stroke(255, 0, 0);
            noFill();
            rect(button.x, button.y - button.height/2, button.width, button.height);
            noStroke();
        }
    }

    mousePressed() {
        // 使用转换后的游戏坐标
        let mouseXGame = window.mouseXGame || mouseX;
        let mouseYGame = window.mouseYGame || mouseY;
        
        console.log("LevelSuccessScreen mousePressed");
        console.log("Mouse position:", mouseX, mouseY);
        console.log("Game mouse position:", mouseXGame, mouseYGame);
        
        for (let button of this.buttons) {
            console.log(`Checking button: ${button.label}`);
            console.log(`Button position: x=${button.x}, y=${button.y}, w=${button.width}, h=${button.height}`);
            
            // 正确计算按钮的点击区域
            let buttonTop = button.y - button.height/2;
            let buttonBottom = button.y + button.height/2;
            let buttonLeft = button.x;
            let buttonRight = button.x + button.width;
            
            console.log(`Click area: left=${buttonLeft}, right=${buttonRight}, top=${buttonTop}, bottom=${buttonBottom}`);
            
            if (mouseYGame > buttonTop &&
                mouseYGame < buttonBottom &&
                mouseXGame > buttonLeft &&
                mouseXGame < buttonRight
            ) {
                console.log(`Button "${button.label}" clicked!`);
                this.screenManager.changeScreen(button.action());
                return; // 防止点击多个按钮
            }
        }
        console.log("No button clicked");
    }

    update(level, score, targetScores) {
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;
    }
}

