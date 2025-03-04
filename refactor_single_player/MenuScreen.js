class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);
        
        // 统一按钮尺寸
        this.buttonWidth = 200;
        this.buttonHeight = 40;
        
        // 在display方法中计算按钮位置
        // 这样可以确保响应窗口大小变化
        this.buttons = [
            {
                label: "Single Player",
                width: this.buttonWidth,
                height: this.buttonHeight,
                mode: "single",
                action: () => {
                    this.screenManager.helpScreen.setMode("single");
                    return this.screenManager.helpScreen;
                }
            },
            {
                label: "Co-op Mode",
                width: this.buttonWidth,
                height: this.buttonHeight,
                mode: "coop",
                action: () => {
                    this.screenManager.helpScreen.setMode("coop");
                    return this.screenManager.helpScreen;
                }
            },
            {
                label: "PvP Mode",
                width: this.buttonWidth,
                height: this.buttonHeight,
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
        
        // 重新计算按钮位置，确保居中
        const centerX = 800 / 2; // 使用基准宽度
        const buttonX = centerX - this.buttonWidth / 2;
        
        // 更新按钮位置
        this.buttons[0].x = buttonX;
        this.buttons[0].y = 600 / 3; // 使用基准高度
        
        this.buttons[1].x = buttonX;
        this.buttons[1].y = 600 / 2;
        
        this.buttons[2].x = buttonX;
        this.buttons[2].y = 600 / 3 * 2;
        
        // 标题
        const titleY = 600 / 5;
        fill(0);
        textSize(25);
        textAlign(CENTER, CENTER);
        text("Select Game Mode", 800 / 2, titleY);

        // 绘制按钮
        for (let button of this.buttons) {
            // 按钮背景
            fill(100);
            rect(button.x, button.y - button.height/2, button.width, button.height);
            
            // 按钮文字
            fill(255);
            textSize(20);
            text(button.label, 800/2, button.y);
            
            // 调试 - 显示按钮边界
            stroke(255, 0, 0);
            noFill();
            rect(button.x, button.y - button.height/2, button.width, button.height);
            noStroke();
        }
    }

    mousePressed() { 
        // 使用游戏坐标系中的鼠标位置
        let mouseXGame = window.mouseXGame || mouseX;
        let mouseYGame = window.mouseYGame || mouseY;
        
        for (let button of this.buttons) {
            // 正确计算按钮的点击区域
            let buttonTop = button.y - button.height/2;
            let buttonBottom = button.y + button.height/2;
            let buttonLeft = button.x;
            let buttonRight = button.x + button.width;
            
            // 检查鼠标是否在按钮区域内
            if (mouseXGame > buttonLeft && 
                mouseXGame < buttonRight && 
                mouseYGame > buttonTop && 
                mouseYGame < buttonBottom) {
                
                let nextScreen = button.action();
                this.screenManager.changeScreen(nextScreen);
                return; // 防止点击多个按钮
            }
        }
    }
}