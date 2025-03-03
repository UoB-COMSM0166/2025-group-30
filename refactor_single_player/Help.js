class Help extends Screen {
    constructor(screenManager) {
        super(screenManager);
        
        // 帮助屏幕的配置
        this.modes = {
            single: {
                title: "单人模式说明",
                instructions: [
                    "使用左右方向键移动",
                    "按空格键将草放入篮子",
                    "每次最多可以堆叠5个草块",
                    "注意不要让草块掉落在地上"
                ],
                buttonText: "开始游戏",
                startAction: () => {
                    this.screenManager.single.startNewGame();
                    this.screenManager.changeScreen(this.screenManager.single);
                }
            },
            coop: {
                title: "双人合作模式说明",
                instructions: [
                    "玩家1使用A/D键移动，玩家2使用左右方向键",
                    "玩家1按W键放入篮子，玩家2按上键放入篮子",
                    "两位玩家合作收集草块",
                    "共享生命值和分数"
                ],
                buttonText: "开始合作",
                startAction: () => {
                    // 这里需要实现双人合作模式的启动逻辑
                    // 暂时返回菜单界面
                    this.screenManager.changeScreen(this.screenManager.menuScreen);
                }
            },
            pvp: {
                title: "双人对战模式说明",
                instructions: [
                    "玩家1使用A/D键移动，玩家2使用左右方向键",
                    "玩家1按W键放入篮子，玩家2按上键放入篮子",
                    "两位玩家互相竞争收集草块",
                    "在时间结束时分数高者获胜"
                ],
                buttonText: "开始对战",
                startAction: () => {
                    // 这里需要实现双人对战模式的启动逻辑
                    // 暂时返回菜单界面
                    this.screenManager.changeScreen(this.screenManager.menuScreen);
                }
            }
        };
        
        // 默认为单人模式
        this.currentMode = "single";
    }
    
    // 设置当前帮助模式
    setMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
        } else {
            console.error("未知的游戏模式: " + mode);
        }
    }
    
    display() {
        const mode = this.modes[this.currentMode];
        
        background(230);
        textAlign(CENTER, CENTER);
        
        // 显示标题
        textSize(32);
        fill(0);
        text(mode.title, width/2, height/4);
        
        // 显示说明文本
        textSize(20);
        for (let i = 0; i < mode.instructions.length; i++) {
            text(mode.instructions[i], width/2, height/2 - 60 + (i * 40));
        }
        
        // 绘制开始按钮
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width/2 - buttonWidth/2;
        let buttonY = height * 3/4 - buttonHeight/2;
        
        fill(0, 200, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        fill(255);
        textSize(24);
        text(mode.buttonText, width/2, height * 3/4);
    }
    
    mousePressed() {
        // 使用转换后的游戏坐标
        let mouseXGame = window.mouseXGame || mouseX;
        let mouseYGame = window.mouseYGame || mouseY;
        
        // 检查是否点击了开始按钮
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width/2 - buttonWidth/2;
        let buttonY = height * 3/4 - buttonHeight/2;
        
        if (mouseXGame > buttonX && mouseXGame < buttonX + buttonWidth &&
            mouseYGame > buttonY && mouseYGame < buttonY + buttonHeight) {
            // 执行当前模式的开始动作
            this.modes[this.currentMode].startAction();
        }
    }
} 