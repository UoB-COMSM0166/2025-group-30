class SingleHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
    }

    display() {
        background(230);
        textAlign(CENTER, CENTER);
        
        // 显示帮助信息
        textSize(32);
        fill(0);
        text("单人模式说明", width/2, height/4);
        
        textSize(20);
        text("使用左右方向键移动", width/2, height/2 - 60);
        text("按空格键将草放入篮子", width/2, height/2 - 20);
        text("每次最多可以堆叠5个草块", width/2, height/2 + 20);
        text("注意不要让草块掉落在地上", width/2, height/2 + 60);
        
        // 绘制开始按钮
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width/2 - buttonWidth/2;
        let buttonY = height * 3/4 - buttonHeight/2;
        
        fill(0, 200, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        fill(255);
        textSize(24);
        text("开始游戏", width/2, height * 3/4);
    }

    mousePressed() {
        // 检查是否点击了开始按钮
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width/2 - buttonWidth/2;
        let buttonY = height * 3/4 - buttonHeight/2;
        
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            // 切换到游戏界面并开始游戏
            this.screenManager.single.reset(); // 确保游戏状态重置
            this.screenManager.changeScreen(this.screenManager.single);
            this.screenManager.single.startGame();
        }
    }
}