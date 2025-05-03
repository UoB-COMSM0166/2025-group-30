class PauseScreen extends Screen {
    constructor(screenManager, gameScreen) {
        super(screenManager);
        this.gameScreen = gameScreen;
        
        // 加载设置图标
        this.settingImage = null;
        this.settingImage2 = null;
        this.loadSettingImages();
        
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
                    // 先播放游戏音乐，再切换屏幕
                    this.screenManager.changeScreen(this.gameScreen);
                    this.screenManager.soundManager.playBackgroundMusic();
                    
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
                    this.screenManager.soundManager.stopBackgroundMusic();
                }
            },
            {
                label: "", // 空标签表示这是图标按钮
                x: baseWidth * 0.9, // 右上角位置
                y: baseHeight * 0.1,
                buttonWidth: 40,
                buttonHeight: 40,
                action: () => {
                    this.screenManager.settingScreen.previousScreen = this;
                    this.screenManager.changeScreen(this.screenManager.settingScreen);
                },
                showLabel: false // 不显示文字标签
            }
        ];
    }

    loadSettingImages() {
        loadImage('./assets/setting.png', img => {
            this.settingImage = img;
        });
        loadImage('./assets/setting2.jpg', img => {
            this.settingImage2 = img;
        });
    }

    display() {
        console.log('PauseScreen display called, currentScreen:', this.screenManager.currentScreen.constructor.name);
        if (this.screenManager.currentScreen === this) {
            console.log('Drawing PauseScreen');
            this.gameScreen.display();
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
                    && window.mouseYGame <= button.y + button.buttonHeight/2;

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
            if (settingButton) {
                const isHovered = this.isMouseOverButton(settingButton);
                
                // 根据悬停状态选择不同的图片
                const currentImage = isHovered ? this.settingImage2 : this.settingImage;
                
                if (currentImage) {
                    image(currentImage, 
                          settingButton.x - settingButton.buttonWidth/2,
                          settingButton.y - settingButton.buttonHeight/2,
                          settingButton.buttonWidth,
                          settingButton.buttonHeight);
                }
            }
        }
    }

    mousePressed() {
        console.log('PauseScreen mousePressed called');
        for (let button of this.buttons) {
            if (this.isMouseOverButton(button)) {
                console.log('Button clicked:', button.label || 'Setting Button');
                button.action();
                console.log('After button action, currentScreen:', this.screenManager.currentScreen.constructor.name);
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
