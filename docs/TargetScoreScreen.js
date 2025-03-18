class TargetScoreScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        this.targetScore = this.gameScreen.targetScores;

        // 按钮设置
        this.buttonWidth = 120;
        this.buttonHeight = 40;
        this.confirmButton = {
            label: "Confirm",
            x: baseWidth / 2,
            y: baseHeight / 2 + 60,
            buttonWidth: this.buttonWidth,
            buttonHeight: this.buttonHeight,
            action: () => {
                this.screenManager.changeScreen(this.gameScreen);
                this.gameScreen.startGrassDropAndLevelTimer();
            }
        };
    }

    display() {
        // 显示游戏画面作为背景
        background(200);
        
        // 根据游戏模式绘制不同的玩家
        if (this.gameScreen === this.screenManager.single) {
            this.gameScreen.basket.draw();
            this.gameScreen.player.drawPlayerWithCaughtGrass();
        } else if (this.gameScreen === this.screenManager.coop) {
            this.gameScreen.basket.draw();
            this.gameScreen.player1.drawPlayerWithCaughtGrass();
            this.gameScreen.player2.drawPlayerWithCaughtGrass();
        }

        // 绘制半透明背景
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // 绘制白色悬浮窗
        fill(255);
        rectMode(CENTER);
        rect(baseWidth/2, baseHeight/2, 300, 200, 10);

        // 显示当前关卡
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`Level ${this.gameScreen.level}`, baseWidth/2, baseHeight/2 - 60);

        // 绘制目标分数文本
        textSize(24);
        text("Target Score", baseWidth/2, baseHeight/2 - 30);
        
        // 显示目标分数值
        textSize(35);
        fill(0);  // 使用黑色显示分数
        text(this.gameScreen.targetScores.toString(), baseWidth/2, baseHeight/2 + 10);

        // 显示确认按钮
        rectMode(CENTER);
        
        // 检查鼠标是否悬停在按钮上
        let isHovered = window.mouseXGame >= this.confirmButton.x - this.confirmButton.buttonWidth/2 
            && window.mouseXGame <= this.confirmButton.x + this.confirmButton.buttonWidth/2 
            && window.mouseYGame >= this.confirmButton.y - this.confirmButton.buttonHeight/2 
            && window.mouseYGame <= this.confirmButton.y + this.confirmButton.buttonHeight/2;

        if (isHovered) {
            fill(100, 100, 255);
        } else {
            fill(70, 70, 200);
        }
        rect(this.confirmButton.x, this.confirmButton.y, this.confirmButton.buttonWidth, this.confirmButton.buttonHeight, 10);
        
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.confirmButton.label, this.confirmButton.x, this.confirmButton.y);
    }

    mousePressed() {
        // 检查是否点击了按钮
        if (window.mouseXGame >= this.confirmButton.x - this.confirmButton.buttonWidth/2 
            && window.mouseXGame <= this.confirmButton.x + this.confirmButton.buttonWidth/2 
            && window.mouseYGame >= this.confirmButton.y - this.confirmButton.buttonHeight/2 
            && window.mouseYGame <= this.confirmButton.y + this.confirmButton.buttonHeight/2) {
            this.confirmButton.action();
        }
    }
} 