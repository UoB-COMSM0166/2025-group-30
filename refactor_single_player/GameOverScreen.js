class GameOverScreen extends Screen { //for single mode
    constructor(screenManager, level = 1, score = 0, targetScores = 0) {
        super(screenManager);
        this.level = level;
        this.score = score;
        this.targetScores = targetScores; // Used for checking if the score met the target

        // 统一按钮尺寸
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // 按钮位置将在display方法中更新
        this.buttons = [
            {
                label: "Home",
                width: this.buttonWidth,
                height: this.buttonHeight,
                color: "rgb(255, 0, 0)", 
                action: () => this.screenManager.homeScreen
            },
            {
                label: "Retry",
                width: this.buttonWidth,
                height: this.buttonHeight,
                color: "rgb(0, 200, 0)", 
                action: () => {
                    // 检查当前的游戏模式
                    if (this.screenManager.lastScreen === this.screenManager.single) {
                        // 单人模式
                        this.screenManager.single.retryCurrentLevel();
                        return this.screenManager.single;
                    } else {
                        // 双人模式
                        this.screenManager.coop.retryCurrentLevel();
                        return this.screenManager.coop;
                    }
                }
            }
        ];
    }

    display() {
        background(200);
        
        // 使用固定的基准尺寸
        const baseWidth = 800;
        const baseHeight = 600;
        
        // 更新按钮位置
        this.buttons[0].x = baseWidth / 4 - this.buttonWidth/2;
        this.buttons[0].y = baseHeight / 5 * 4;
        
        this.buttons[1].x = baseWidth / 4 * 3 - this.buttonWidth/2;
        this.buttons[1].y = baseHeight / 5 * 4;
        
        // 游戏结束弹窗
        const panelWidth = 300;
        const panelHeight = 250;
        const panelX = baseWidth / 2 - panelWidth / 2;
        const panelY = baseHeight / 2 - panelHeight / 2;
        
        fill(255);
        rect(panelX, panelY, panelWidth, panelHeight);

        // 文本内容
        fill(0);
        textAlign(CENTER, CENTER);
        
        textSize(22);
        text("Game Over", baseWidth / 2, baseHeight / 2 - 70);
        
        textSize(16);
        text(`Your Score: ${this.score}`, baseWidth / 2, baseHeight / 2 + 20);
        text(`Target Score: ${this.targetScores}`, baseWidth / 2, baseHeight / 2 + 40);

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
        
        for (let button of this.buttons) {
            
            // 正确计算按钮的点击区域
            let buttonTop = button.y - button.height/2;
            let buttonBottom = button.y + button.height/2;
            let buttonLeft = button.x;
            let buttonRight = button.x + button.width;
            
            if (mouseYGame > buttonTop &&
                mouseYGame < buttonBottom &&
                mouseXGame > buttonLeft &&
                mouseXGame < buttonRight
            ) {
                this.screenManager.changeScreen(button.action());
                return; // 防止点击多个按钮
            }
        }
    }

    // Update the content of the GameOverScreen
    update(level, score, targetScores) {
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;
    }
}
