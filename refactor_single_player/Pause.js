class Pause extends Screen {
    constructor(screenManager) {
        super(screenManager);
        this.lastScreen = null; // 存储暂停前的屏幕
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonSpacing = 30;
        this.baseWidth = 800; // 添加基准宽度
        this.baseHeight = 600; // 添加基准高度
        this.buttons = []; // 初始化按钮数组
    }

    // 设置上一个屏幕（暂停前的游戏屏幕）
    setLastScreen(screen) {
        this.lastScreen = screen;
        // 重置按钮数组，避免重复添加
        this.buttons = [];
    }

    // 显示暂停界面
    display() {
        if (!this.lastScreen) return;
        
        // 在暂停状态下仍然显示游戏界面
        this.lastScreen.display();
        
        // 半透明背景
        push();
        fill(0, 0, 0, 180); // 70%透明度的黑色背景
        rectMode(CORNER);
        rect(0, 0, this.baseWidth, this.baseHeight);
        
        // 暂停标题
        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("PAUSE", this.baseWidth/2, this.baseHeight/2 - 100);
        
        // 绘制按钮
        this.drawButton("Resume", this.baseWidth/2, this.baseHeight/2, this.resumeGame.bind(this));
        this.drawButton("Restart", this.baseWidth/2, this.baseHeight/2 + this.buttonHeight + this.buttonSpacing, this.restartGame.bind(this));
        this.drawButton("Home", this.baseWidth/2, this.baseHeight/2 + (this.buttonHeight + this.buttonSpacing) * 2, this.returnHome.bind(this));
        pop();
    }
    
    // 绘制按钮
    drawButton(label, x, y, callback) {
        rectMode(CENTER);
        
        // 使用转换后的游戏坐标系来判断鼠标悬停
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        // 如果page对象存在，转换鼠标坐标到游戏坐标系
        if (this.screenManager && this.screenManager.page) {
            mouseXGame = this.screenManager.page.mouseXGame;
            mouseYGame = this.screenManager.page.mouseYGame;
        }
        
        let isHovered = mouseXGame >= x - this.buttonWidth/2 && mouseXGame <= x + this.buttonWidth/2 &&
                         mouseYGame >= y - this.buttonHeight/2 && mouseYGame <= y + this.buttonHeight/2;
        
        // 按钮背景
        fill(isHovered ? color(100, 100, 255) : color(70, 70, 200));
        rect(x, y, this.buttonWidth, this.buttonHeight, 10);
        
        // 按钮文字
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(label, x, y);
        
        // 存储按钮信息（用于点击检测）
        let buttonExists = this.buttons.some(btn => btn.label === label);
        if (!buttonExists) {
            this.buttons.push({
                label: label,
                x: x,
                y: y,
                width: this.buttonWidth,
                height: this.buttonHeight,
                callback: callback
            });
        }
    }
    
    // 处理鼠标点击
    mousePressed() {
        if (!this.buttons || this.buttons.length === 0) return;
        
        // 使用转换后的游戏坐标系来检测点击
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        // 如果page对象存在，转换鼠标坐标到游戏坐标系
        if (this.screenManager && this.screenManager.page) {
            mouseXGame = this.screenManager.page.mouseXGame;
            mouseYGame = this.screenManager.page.mouseYGame;
        }
        
        for (let button of this.buttons) {
            if (mouseXGame >= button.x - button.width/2 && mouseXGame <= button.x + button.width/2 &&
                mouseYGame >= button.y - button.height/2 && mouseYGame <= button.y + button.height/2) {
                button.callback();
                return; // 防止多个按钮同时响应
            }
        }
    }
    
    // 处理键盘输入 - ESC键也可以继续游戏
    keyPressed() {
        if (keyCode === ESCAPE) {
            this.resumeGame();
        }
    }
    
    // 继续游戏
    resumeGame() {
        if (this.lastScreen) {
            this.lastScreen.resumeGame();  // 恢复游戏
            this.screenManager.changeScreen(this.lastScreen);
        }
    }
    
    // 重新开始游戏
    restartGame() {
        if (this.lastScreen) {
            // 根据游戏模式调用不同的重新开始逻辑
            if (this.lastScreen instanceof Single || this.lastScreen instanceof Coop) {
                // Single和Coop模式使用retryCurrentLevel逻辑
                this.screenManager.changeScreen(this.lastScreen);
                this.lastScreen.retryCurrentLevel();
            } else if (this.lastScreen instanceof Pvp) {
                // Pvp模式使用startNewGame逻辑
                this.screenManager.changeScreen(this.lastScreen);
                this.lastScreen.startNewGame();
            }
        }
    }
    
    // 返回主界面
    returnHome() {
        if (this.lastScreen) {
            // 先重置游戏状态
            if (this.lastScreen instanceof Single || this.lastScreen instanceof Coop) {
                this.lastScreen.retryCurrentLevel(); // 使用retryCurrentLevel来清理状态
            } else if (this.lastScreen instanceof Pvp) {
                this.lastScreen.startNewGame(); // 使用startNewGame来清理状态
            }
            
            // 切换到主界面
            this.screenManager.changeScreen(this.screenManager.homeScreen);
        }
    }
}
