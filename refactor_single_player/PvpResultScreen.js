class PvpResultScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        
        // 使用固定基准尺寸
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // 玩家分数初始值
        this.player1Score = 0;
        this.player2Score = 0;
        
        // 按钮尺寸
        this.buttonWidth = 200;
        this.buttonHeight = 60;
        
        // 主菜单按钮位置
        this.menuButtonX = this.baseWidth / 2 - this.buttonWidth / 2;
        this.menuButtonY = this.baseHeight - 150;
        
        // 重新开始按钮位置
        this.restartButtonX = this.baseWidth / 2 - this.buttonWidth / 2;
        this.restartButtonY = this.baseHeight - 80;
    }
    
    // 更新玩家分数
    update(player1Score, player2Score) {
        this.player1Score = player1Score;
        this.player2Score = player2Score;
    }
    
    // 显示结果屏幕
    display() {
        background(220);
        
        // 标题
        textSize(40);
        textAlign(CENTER);
        fill(0);
        text("对战结果", this.baseWidth / 2, 80);
        
        // 左侧玩家
        textSize(30);
        textAlign(CENTER);
        fill('red');
        text("玩家 1", this.baseWidth / 4, 150);
        
        textSize(60);
        text(this.player1Score, this.baseWidth / 4, 220);
        
        // 右侧玩家
        textSize(30);
        fill('blue');
        text("玩家 2", this.baseWidth * 3 / 4, 150);
        
        textSize(60);
        text(this.player2Score, this.baseWidth * 3 / 4, 220);
        
        // 胜负结果
        textSize(35);
        let scoreDiff = Math.abs(this.player1Score - this.player2Score);
        
        if (this.player1Score > this.player2Score) {
            fill('red');
            text("玩家 1 获胜！", this.baseWidth / 2, 300);
            textSize(25);
            text(`领先 ${scoreDiff} 分`, this.baseWidth / 2, 340);
        } else if (this.player2Score > this.player1Score) {
            fill('blue');
            text("玩家 2 获胜！", this.baseWidth / 2, 300);
            textSize(25);
            text(`领先 ${scoreDiff} 分`, this.baseWidth / 2, 340);
        } else {
            fill(0);
            text("平局！", this.baseWidth / 2, 300);
            textSize(25);
            text("两位玩家势均力敌", this.baseWidth / 2, 340);
        }
        
        // 按钮
        this.drawMenuButton();
        this.drawRestartButton();
    }
    
    // 绘制主菜单按钮
    drawMenuButton() {
        // 正常状态按钮颜色
        fill(100, 100, 200);
        
        // 悬停效果
        if (this.isMouseOverMenuButton()) {
            fill(120, 120, 220); // 鼠标悬停时颜色更亮
            cursor(HAND); // 更改鼠标样式
        } else {
            cursor(ARROW);
        }
        
        rect(this.menuButtonX, this.menuButtonY, this.buttonWidth, this.buttonHeight, 10);
        
        textSize(24);
        textAlign(CENTER, CENTER);
        fill(255);
        text("返回主菜单", this.menuButtonX + this.buttonWidth / 2, this.menuButtonY + this.buttonHeight / 2);
    }
    
    // 绘制重新开始按钮
    drawRestartButton() {
        // 正常状态按钮颜色
        fill(100, 200, 100);
        
        // 悬停效果
        if (this.isMouseOverRestartButton()) {
            fill(120, 220, 120); // 鼠标悬停时颜色更亮
            cursor(HAND); // 更改鼠标样式
        } else if (!this.isMouseOverMenuButton()) {
            cursor(ARROW);
        }
        
        rect(this.restartButtonX, this.restartButtonY, this.buttonWidth, this.buttonHeight, 10);
        
        textSize(24);
        textAlign(CENTER, CENTER);
        fill(255);
        text("再来一局", this.restartButtonX + this.buttonWidth / 2, this.restartButtonY + this.buttonHeight / 2);
    }
    
    // 检查鼠标是否在主菜单按钮上
    isMouseOverMenuButton() {
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        if (window.page) {
            let coords = window.page.transformCoordinates(mouseX, mouseY);
            mouseXGame = coords.x;
            mouseYGame = coords.y;
        }
        
        return (mouseXGame > this.menuButtonX && 
                mouseXGame < this.menuButtonX + this.buttonWidth &&
                mouseYGame > this.menuButtonY && 
                mouseYGame < this.menuButtonY + this.buttonHeight);
    }
    
    // 检查鼠标是否在重新开始按钮上
    isMouseOverRestartButton() {
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        if (window.page) {
            let coords = window.page.transformCoordinates(mouseX, mouseY);
            mouseXGame = coords.x;
            mouseYGame = coords.y;
        }
        
        return (mouseXGame > this.restartButtonX && 
                mouseXGame < this.restartButtonX + this.buttonWidth &&
                mouseYGame > this.restartButtonY && 
                mouseYGame < this.restartButtonY + this.buttonHeight);
    }
    
    // 处理鼠标点击
    mousePressed() {
        // 检测点击主菜单按钮
        if (this.isMouseOverMenuButton()) {
            // 返回主菜单
            this.screenManager.changeScreen(this.screenManager.menuScreen);
            return;
        }
        
        // 检测点击重新开始按钮
        if (this.isMouseOverRestartButton()) {
            // 创建新的PvP游戏
            let pvp = new Pvp(this.screenManager);
            this.screenManager.changeScreen(pvp);
            pvp.startGame();
            return;
        }
    }
}
