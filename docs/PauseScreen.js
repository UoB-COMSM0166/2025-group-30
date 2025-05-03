class PauseScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        
        // 加载设置图标
        this.settingImage = null;
        this.loadSettingImage();
        
        this.buttonSpacing = 30;
        this.buttons = [
            {
                label: "Continue",
                x: baseWidth / 2,
                y: baseHeight / 2,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Restart",
                x: baseWidth / 2,
                y: baseHeight / 2 + 50 + this.buttonSpacing,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.gameScreen.restartFromCurrentLevel();
                    this.screenManager.changeScreen(this.gameScreen);
                }
            },
            {
                label: "Home",
                x: baseWidth / 2,
                y: baseHeight / 2 + (50 + this.buttonSpacing) * 2,
                buttonWidth: 200,
                buttonHeight: 50,
                action: () => {
                    this.gameScreen.clearStats();
                    this.screenManager.changeScreen(this.screenManager.homeScreen);
                }
            },
            {
                label: "", // 空标签表示这是图标按钮
                x: baseWidth * 0.9, // 右上角位置
                y: baseHeight * 0.1,
                buttonWidth: 40,
                buttonHeight: 40,
                action: () => {
                    // 使用新实例而非共享的settingScreen
                    const settingScreen = new SettingScreen(this.screenManager, this);
                    this.screenManager.changeScreen(settingScreen);
                },
                showLabel: false // 不显示文字标签
            }
        ];
    }

    loadSettingImage() {
        loadImage('./assets/setting1.png', img => {
            this.settingImage = img;
        });
    }

    display() {
        this.gameScreen.display();
        if (this.screenManager.currentScreen === this) {


            // Draw semi-transparent overlay
            fill(0, 0, 0, 180);
            rectMode(CORNER);
            rect(0, 0, baseWidth, baseHeight);


            // Draw pause menu title
            fill(254, 224, 173);
            textFont('Comic Sans MS');
            textStyle(BOLD);
            textSize(40);
            textAlign(CENTER, CENTER);
            text("PAUSE", baseWidth / 2, baseHeight / 2 - 100);

            // Display buttons
            for (let button of this.buttons) {
                rectMode(CENTER);
                // 跳过设置按钮的默认矩形绘制
                if (button.label === "") continue;
                // Check if mouse is hovering over button
                let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                    && window.mouseXGame <= button.x + button.buttonWidth / 2
                    && window.mouseYGame >= button.y - button.buttonHeight / 2
                    && window.mouseYGame <= button.y + button.buttonHeight / 2;

                let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);

                if (isHovered) {
                    fill(255, 210, 160);
                } else {
                    fill(243, 186, 125);
                }
                if (isFocused) {
                    stroke(14, 105, 218);
                    strokeWeight(4);
                }
                rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

                // Draw button text
                noStroke();
                fill(147, 75, 43);
                textFont('Comic Sans MS');
                textStyle(BOLD);
                textSize(20);
                textAlign(CENTER, CENTER);
                text(button.label, button.x, button.y);
            }
            // 单独绘制设置图标
            const settingButton = this.buttons.find(b => b.label === "");
            if (settingButton && this.settingImage) {
                const isHovered = this.isMouseOverButton(settingButton);
                
                // 悬停效果
                if (isHovered) {
                    push();
                    tint(255, 200); // 半透明效果
                    image(this.settingImage, 
                          settingButton.x - settingButton.buttonWidth/2,
                          settingButton.y - settingButton.buttonHeight/2,
                          settingButton.buttonWidth,
                          settingButton.buttonHeight);
                    pop();
                } else {
                    image(this.settingImage, 
                          settingButton.x - settingButton.buttonWidth/2,
                          settingButton.y - settingButton.buttonHeight/2,
                          settingButton.buttonWidth,
                          settingButton.buttonHeight);
                }
            }
        }
    }

    mousePressed() {
        for (let button of this.buttons) {
            if (this.isMouseOverButton(button)) {
                button.action();
                return;
            }
        }
    }
    
    isMouseOverButton(button) {
        return window.mouseXGame >= button.x - button.buttonWidth/2 &&
               window.mouseXGame <= button.x + button.buttonWidth/2 &&
               window.mouseYGame >= button.y - button.buttonHeight/2 &&
               window.mouseYGame <= button.y + button.buttonHeight/2;
    }
}
