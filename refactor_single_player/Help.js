class Help extends Screen {
    constructor(screenManager) {
        super(screenManager);
        
        // 按钮尺寸和位置
        this.buttonWidth = 200;
        this.buttonHeight = 60;
        
        // 帮助屏幕的配置
        this.modes = {
            single: {
                title: "Single Player Instructions",
                instructions: [
                    "Use LEFT/RIGHT arrow keys to move",
                    "Press SPACE to place hay in the basket",
                    "You can stack up to 5 hay blocks",
                    "Don't let hay blocks fall to the ground"
                ],
                buttonText: "Start Game",
                startAction: () => {
                    this.screenManager.single.startNewGame();
                    this.screenManager.changeScreen(this.screenManager.single);
                }
            },
            coop: {
                title: "Co-op Mode Instructions",
                instructions: [
                    "Player 1: Use A/D keys to move, Player 2: Use LEFT/RIGHT",
                    "Player 1: Press SPACE to place hay, Player 2: Press ENTER",
                    "Work together to collect hay blocks",
                    "Share lives and score"
                ],
                buttonText: "Start Co-op",
                startAction: () => {
                    this.screenManager.coop.startNewGame();
                    this.screenManager.changeScreen(this.screenManager.coop);
                }
            },
            pvp: {
                title: "PvP Mode Instructions",
                instructions: [
                    "Player 1: Use A/D keys to move, Player 2: Use LEFT/RIGHT",
                    "Player 1: Press SPACE to place hay, Player 2: Press ENTER",
                    "Compete to collect more hay blocks",
                    "The player with higher score at the end wins"
                ],
                buttonText: "Start PvP",
                startAction: () => {
                    this.screenManager.pvp.startNewGame();
                    this.screenManager.changeScreen(this.screenManager.pvp);
                }
            }
        };
        
        // 默认为单人模式
        this.currentMode = "single";
        
        // 按钮的位置会在display方法中计算
        this.buttonX = 0;
        this.buttonY = 0;
    }
    
    // 设置当前帮助模式
    setMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
        } else {
            console.error("Unknown game mode: " + mode);
        }
    }
    
    display() {
        const mode = this.modes[this.currentMode];
        
        background(230);
        textAlign(CENTER, CENTER);
        
        // 使用固定的基准尺寸
        const baseWidth = 800;
        const baseHeight = 600;
        
        // 显示标题
        const titleY = baseHeight/4;
        textSize(32);
        fill(0);
        text(mode.title, baseWidth/2, titleY);
        
        // 显示说明文本
        const instructionsStartY = baseHeight/2 - 60;
        const lineHeight = 40;
        textSize(20);
        for (let i = 0; i < mode.instructions.length; i++) {
            text(mode.instructions[i], baseWidth/2, instructionsStartY + (i * lineHeight));
        }
        
        // 计算并存储按钮位置
        this.buttonY = baseHeight * 3/4;
        this.buttonX = baseWidth/2 - this.buttonWidth/2;
        
        // 绘制开始按钮
        fill(0, 200, 0);
        rect(this.buttonX, this.buttonY - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
        
        fill(255);
        textSize(24);
        text(mode.buttonText, baseWidth/2, this.buttonY);
        
        // 调试 - 显示按钮边界
        stroke(255, 0, 0);
        noFill();
        rect(this.buttonX, this.buttonY - this.buttonHeight/2, this.buttonWidth, this.buttonHeight);
        noStroke();
    }
    
    mousePressed() {
        // 使用转换后的游戏坐标
        let mouseXGame = window.mouseXGame || mouseX;
        let mouseYGame = window.mouseYGame || mouseY;
        
        console.log("Help mousePressed");
        console.log("Mouse position:", mouseX, mouseY);
        console.log("Game mouse position:", mouseXGame, mouseYGame);
        
        // 计算按钮的点击区域
        let buttonTop = this.buttonY - this.buttonHeight/2;
        let buttonBottom = this.buttonY + this.buttonHeight/2;
        let buttonLeft = this.buttonX;
        let buttonRight = this.buttonX + this.buttonWidth;
        
        console.log(`Button position: x=${this.buttonX}, y=${this.buttonY}, w=${this.buttonWidth}, h=${this.buttonHeight}`);
        console.log(`Click area: left=${buttonLeft}, right=${buttonRight}, top=${buttonTop}, bottom=${buttonBottom}`);
        
        // 检查是否点击了开始按钮
        if (mouseXGame > buttonLeft && mouseXGame < buttonRight &&
            mouseYGame > buttonTop && mouseYGame < buttonBottom) {
            console.log(`Start button clicked!`);
            // 执行当前模式的开始动作
            this.modes[this.currentMode].startAction();
        } else {
            console.log("Button not clicked");
        }
    }
} 