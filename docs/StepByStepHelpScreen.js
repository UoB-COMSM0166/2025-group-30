class StepByStepHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // 添加背景图片和颜色变量
        this.backgroundImage = null;
        this.backgroundColor = color(222, 234, 235); // 默认背景色
        this.loadBackgroundImage(); // 加载背景图片
        // 添加警告图标
        this.warningIcon = null;
        this.loadWarningIcon(); // 加载警告图标
        // 添加按钮相关变量
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // 添加标题动画相关变量
        this.titleFinalSize = 34;      // 标题最终字体大小
        this.titleCurrentSize = 0;     // 标题当前字体大小（初始为0）
        this.titleAnimationActive = true; // 标题动画是否激活
        this.titleAnimationStartTime = null;  // 标题动画开始时间
        this.titleAnimationDuration = 1000;   // 标题动画持续时间（1秒）

        // Replace separate progress and instruction animation variables with combined text animation variables
        this.textYOffset = 30;         // Text initial Y offset
        this.textAnimationActive = true;   // Text animation active state
        this.textAnimationStartTime = null; // Text animation start time
        this.textAnimationDuration = 500;  // Text animation duration (0.8s)
        this.textOpacity = 0;              // Text opacity

        this.buttons = [
            {
                label: "Back", //only show on first step
                x: baseWidth / 4,
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Previous",
                x: baseWidth / 4,
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.previousStep()
            },
            {
                label: "Next",
                x: baseWidth / 4 * 3,
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.nextStep()
            },
            {
                label: "Start", //only show on last step
                x: baseWidth / 4 * 3,
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.currentStep = 0;
                    this.demoPlayer.stack = [];
                    this.screenManager.changeScreen(this.screenManager.menuScreen);
                }
            }
        ];

        this.title = "Tutorial";

        this.demoPlayer = new Player("middle");
        this.demoPlayer.y = baseHeight / 3 * 2; // Position higher for visibility

        this.demoBasket = new Basket("left");
        this.demoBasket.y = baseHeight / 2;
        this.demoPlayer.basket = this.demoBasket;

        // Tutorial steps
        this.currentStep = 0;
        this.tutorialSteps = [
            { //step 1
                instruction: "Press ← or → keys to move",
                setup: () => { this.demoPlayer.stack = []; },
                update: () => {
                    // Handle player movement in the demo
                    this.handlePlayerMovement();
                },
                draw: () => {
                    // Draw the player
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 2
                instruction: "Move under the falling hay block to catch it",
                setup: () => {
                    this.demoPlayer.stack = [];
                    // Add a falling grass block
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },
                update: () => {
                    // Handle player movement in the demo
                    this.handlePlayerMovement();

                    // Only move the grass if it exists
                    if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();

                        // Check if grass is caught
                        if (this.demoPlayer.catches(this.demoGrass)) {
                            // If grass is caught, don't create a new one
                            this.demoGrass = null;
                        }

                        // If grass falls off screen, create a new one
                        if (this.demoGrass && this.demoGrass.y > baseHeight) {
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                        }
                    }
                },
                draw: () => {
                    // Draw the falling grass if it exists                  
                    if (this.demoGrass) {
                        this.demoGrass.draw();
                    }

                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    if (this.demoPlayer.stack.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 3
                instruction: "Press SPACE when near the basket to empty your stack",
                setup: () => {
                    if (this.demoPlayer.stack.length === 1) { return; }
                    // put a grass block in the player's stack
                    this.demoGrass = new Grass();
                    this.demoGrass.x = this.demoPlayer.x + this.demoPlayer.w / 2 - this.demoGrass.w / 2;
                    this.demoGrass.y = this.demoPlayer.y - this.demoGrass.h;
                    this.demoPlayer.stack = [this.demoGrass];
                },
                update: () => {
                    // Handle player movement
                    this.handlePlayerMovement();

                    // Check for space key to empty to basket
                    if (keyIsDown(32)) { // 32 is the keyCode for SPACE
                        this.demoPlayer.emptyToBasket();
                    }
                },
                draw: () => {
                    // Draw the basket
                    this.demoBasket.draw();

                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    if (this.demoPlayer.stack.length === 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 4
                instruction: `Catch one more hay block to exceed the limit of 5`,
                setup: () => {
                    // Clear the player's stack
                    this.demoPlayer.stack = [];

                    // Add 5 grass blocks to the player's stack
                    for (let i = 0; i < 5; i++) {
                        let grass = new Grass();
                        //create a staggered stack of grass blocks
                        grass.x = random(this.demoPlayer.x + this.demoPlayer.w / 4 - 20, this.demoPlayer.x + this.demoPlayer.w / 4 + 20);
                        grass.y = this.demoPlayer.y - (i + 1) * grass.h;
                        this.demoPlayer.stack.push(grass);
                    }

                    // Add one falling grass block to demonstrate exceeding the limit
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },

                update: () => {
                    // Handle player movement
                    this.handlePlayerMovement();
                    // Only move the grass if it exists
                    if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();

                        // Check if grass is caught
                        if (this.demoPlayer.catches(this.demoGrass)) {
                            // If grass is caught, don't create a new one
                            this.demoGrass = null;
                        }

                        // If grass falls off screen, create a new one
                        if (this.demoGrass && this.demoGrass.y > baseHeight) {
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                        }
                    }
                },
                draw: () => {
                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();

                    // Draw falling grass if it exists
                    if (this.demoGrass) {
                        this.demoGrass.draw();
                    }

                    // Display message with emphasized limit
                    textAlign(LEFT);

                    // If flashing, show explanation
                    if (!this.demoGrass) {
                        // 绘制白色透明背景框
                        rectMode(CENTER);
                        noStroke();
                        fill(255, 255, 255, 180); // 白色半透明
                        rect(baseWidth / 2, baseHeight / 2, 500, 60, 15); // 圆角矩形，高度调大

                        // 设置文本为金黄色
                        fill(255, 215, 0); // 金黄色
                        textAlign(CENTER);
                        textSize(24);

                        // 如果警告图标已加载，则显示图标和文本
                        if (this.warningIcon) {
                            // 放大图标尺寸
                            const iconSize = 50;

                            // 绘制图标在背景框左侧
                            image(this.warningIcon, baseWidth / 2 - 230, baseHeight / 2 - iconSize / 2, iconSize, iconSize);

                            // 绘制文本，位于图标右侧
                            textAlign(LEFT);
                            text("Stack exceeded! All blocks dropped!", baseWidth / 2 - 170, baseHeight / 2 + 8);
                        } else {
                            // 如果图标尚未加载，只显示文本
                            text("Stack exceeded! All blocks dropped!", baseWidth / 2, baseHeight / 2);
                        }
                    }
                },
                checkCompletion: () => {
                    if (this.demoPlayer.flash.getFlashDuration > 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 5
                instruction: "You're ready to play! Click 'Start' to select play mode.",
                setup: () => {
                    // No demo needed for final step
                },
                update: () => {
                    // No updates needed
                },
                draw: () => {
                    // No drawing needed
                },
                checkCompletion: () => {
                    return true;
                }
            }
        ];

        // Initialize the first step
        this.tutorialSteps[this.currentStep].setup();

        // 初始化ScreenManager覆盖
        this.initScreenManagerOverride();
    }

    // 加载背景图片方法
    loadBackgroundImage() {
        // 加载背景图片
        loadImage('./assets/Tutorial-background.webp', img => {
            this.backgroundImage = img;
        });
    }

    // 加载警告图标方法
    loadWarningIcon() {
        // 加载警告图标
        loadImage('./assets/warning.gif', img => {
            this.warningIcon = img;
        });
    }

    // 更新标题动画
    updateTitleAnimation() {
        if (this.titleAnimationActive) {
            // 初始化动画开始时间
            if (this.titleAnimationStartTime === null) {
                this.titleAnimationStartTime = millis();
            }

            // 计算当前动画进度（0-1之间）
            const currentTime = millis();
            const elapsedTime = currentTime - this.titleAnimationStartTime;
            const progress = constrain(elapsedTime / this.titleAnimationDuration, 0, 1);

            // 使用缓动函数使动画更自然
            const easedProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果

            // 更新当前字体大小
            this.titleCurrentSize = this.titleFinalSize * easedProgress;

            // 检查动画是否完成
            if (progress >= 1) {
                this.titleAnimationActive = false;
                this.titleCurrentSize = this.titleFinalSize;

                // 标题动画完成后，启动文本动画
                if (this.textAnimationStartTime === null) {
                    this.textAnimationStartTime = millis();
                }
            }
        } else {
            // 如果动画未激活，使用最终大小
            this.titleCurrentSize = this.titleFinalSize;
        }
    }

    // Replace both updateProgressAnimation and updateInstructionAnimation with single method
    updateTextAnimation() {
        // Only start text animation after title animation is complete
        if (!this.titleAnimationActive && this.textAnimationActive) {
            // Initialize animation start time
            if (this.textAnimationStartTime === null) {
                this.textAnimationStartTime = millis();
            }

            // Calculate current animation progress (0-1)
            const currentTime = millis();
            const elapsedTime = currentTime - this.textAnimationStartTime;
            const progress = constrain(elapsedTime / this.textAnimationDuration, 0, 1);

            // Use easing function for smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out

            // Update Y offset and opacity for both texts simultaneously
            this.textYOffset = 30 * (1 - easedProgress);
            this.textOpacity = 255 * easedProgress;

            // Check if animation is complete
            if (progress >= 1) {
                this.textAnimationActive = false;
                this.textYOffset = 0;
                this.textOpacity = 255;
            }
        } else if (!this.textAnimationActive) {
            // If animation is inactive or complete, use final values
            this.textYOffset = 0;
            this.textOpacity = 255;
        }
    }

    previousStep() {
        // Move to the previous tutorial step
        if (this.currentStep > 0) {
            this.currentStep--;
            this.tutorialSteps[this.currentStep].setup();
            // 重置文本动画，在步骤切换时重播动画
            this.resetTextAnimations();
        }
    }

    nextStep() {
        // Move to the next tutorial step
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.tutorialSteps[this.currentStep].setup();
            // 重置文本动画，在步骤切换时重播动画
            this.resetTextAnimations();
        }
    }

    display() {
        // 设置背景色 - 使用构造函数中设置的默认颜色
        background(this.backgroundColor);

        // 显示背景图片，底部对齐
        if (this.backgroundImage) {
            // 计算缩放比例，保持图片比例
            let scale = Math.min(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );

            // 计算水平居中但垂直底部对齐的位置
            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;
            let x = (baseWidth - newWidth) / 2; // 水平居中
            let y = baseHeight - newHeight;     // 底部对齐

            // 绘制图片，保持原始比例，底部对齐
            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        // Update all animations
        this.updateTitleAnimation();
        this.updateTextAnimation();

        // Display title - 使用卡通风格字体、白色文本和指定颜色阴影
        textAlign(CENTER, CENTER);
        textSize(this.titleCurrentSize); // 使用动画大小

        // 设置卡通风格字体
        textFont("Comic Sans MS, Chalkboard, Marker Felt, sans-serif");

        // 只有当字体大小大于0时才绘制文本（避免动画开始时闪烁）
        if (this.titleCurrentSize > 1) {
            // 先绘制阴影，增加立体感
            fill(214, 237, 250);
            textStyle(BOLD);
            text(this.title, baseWidth / 2 + 1.5, baseHeight / 8 + 1.5); // 减小阴影偏移

            // 再绘制墨灰色文本
            fill(51, 51, 51);
            text(this.title, baseWidth / 2, baseHeight / 8);
        }

        // 重置为默认字体和样式
        textFont("sans-serif");
        textStyle(NORMAL);

        // Display progress text and instruction text with the same animation
        textSize(16);
        fill(123, 164, 79, this.textOpacity);
        text(`Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`,
            baseWidth / 2,
            baseHeight / 8 + 40 + this.textYOffset);

        // Display instruction text
        textSize(18);
        fill(91, 132, 60, this.textOpacity); // Using the same green color as progress text
        textStyle(ITALIC);
        text(this.tutorialSteps[this.currentStep].instruction,
            baseWidth / 2,
            baseHeight / 4 + this.textYOffset);
        textStyle(NORMAL);

        // 绘制从指令文本底部到按钮上方的半透明白色背景框
        noStroke();
        fill(255, 255, 255, 178); // 透明度70%的白色 (255 * 0.7 = 178)
        rectMode(CENTER);

        // 计算指令文本底部位置（指令文本位置加上一些垂直间距）
        let instructionBottomY = baseHeight / 4 + 30; // 指令文本位置加上一些垂直间距

        // 计算按钮上方位置
        let buttonTopY = baseHeight / 6 * 5 - this.buttonHeight / 2 - 30; // 按钮上方预留一些间距

        // 计算矩形高度
        let rectHeight = buttonTopY - instructionBottomY;

        // 计算矩形中心点
        let rectCenterY = instructionBottomY + rectHeight / 2;

        // 绘制矩形
        rect(baseWidth / 2, rectCenterY, baseWidth, rectHeight);

        // 只有当所有动画完成后才更新和绘制教程步骤内容
        if (!this.titleAnimationActive && !this.textAnimationActive) {
            // Update and draw the current step
            this.tutorialSteps[this.currentStep].update();
            this.tutorialSteps[this.currentStep].draw();
        }

        // Draw buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth / 2
                && window.mouseXGame <= button.x + this.buttonWidth / 2
                && window.mouseYGame >= button.y - this.buttonHeight / 2
                && window.mouseYGame <= button.y + this.buttonHeight / 2;

            // 设置按钮样式 - 使用与菜单屏幕相似的绿色系
            strokeWeight(2);
            if (isHovered) {
                // 悬停状态
                stroke(111, 148, 112, 230); // 与MenuScreen特殊按钮边框色一致
                fill(95, 140, 96, 230); // 与MenuScreen特殊按钮填充色一致
            } else {
                // 非悬停状态
                stroke(111, 148, 112, 180); // 与MenuScreen特殊按钮边框色一致
                fill(95, 140, 96, 200); // 与MenuScreen特殊按钮填充色一致
            }

            // Only show Next button if not on the last step
            if (button.label === "Next" && this.currentStep >= this.tutorialSteps.length - 1) {
                continue;
            }

            // Only show Previous button if not on the first step
            if (button.label === "Previous" && this.currentStep <= 0) {
                continue;
            }

            // Only show Start button if on the last step
            if (button.label === "Start" && this.currentStep !== this.tutorialSteps.length - 1) {
                continue;
            }

            // Only show Back button if on the first step
            if (button.label === "Back" && this.currentStep !== 0) {
                continue;
            }

            // 绘制圆角矩形按钮
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight, 10);

            // 按钮文字 - 白色文本更加清晰
            noStroke();
            fill(255, 255, 255, isHovered ? 255 : 220);
            textSize(16);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
            textStyle(NORMAL);
        }
    }

    keyPressed() {
        // Track if player has moved for the first step
        if (this.currentStep === 0 && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
            this.playerHasMoved = true;
        }

        // Call the parent keyPressed method
        super.keyPressed();
    }

    // Override the mousePressed method to respect button visibility conditions
    mousePressed() {
        if (!this.buttons) return;
        for (let button of this.buttons) {
            // Skip buttons that shouldn't be visible based on current step
            if (button.label === "Next" && this.currentStep >= this.tutorialSteps.length - 1) {
                continue;
            }
            if (button.label === "Previous" && this.currentStep <= 0) {
                continue;
            }
            if (button.label === "Start" && this.currentStep !== this.tutorialSteps.length - 1) {
                continue;
            }
            if (button.label === "Back" && this.currentStep !== 0) {
                continue;
            }

            // Calculate button click area
            let buttonTop = button.y - button.buttonHeight / 2;
            let buttonBottom = button.y + button.buttonHeight / 2;
            let buttonLeft = button.x - button.buttonWidth / 2;
            let buttonRight = button.x + button.buttonWidth / 2;

            // Check if mouse is in button area
            if (window.mouseXGame > buttonLeft &&
                window.mouseXGame < buttonRight &&
                window.mouseYGame > buttonTop &&
                window.mouseYGame < buttonBottom) {

                button.action();
                return; // Prevent clicking multiple buttons
            }
        }
    }

    // Helper function to handle player movement input
    handlePlayerMovement() {
        if (keyIsDown(LEFT_ARROW)) {
            this.demoPlayer.dir = -1;
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.demoPlayer.dir = 1;
        } else {
            this.demoPlayer.dir = 0;
        }
        this.demoPlayer.movePlayerWithCaughtGrass();
    }

    // Update resetAnimation() method
    resetAnimation() {
        // Reset title animation
        this.titleAnimationActive = true;
        this.titleAnimationStartTime = null;
        this.titleCurrentSize = 0;

        // Reset combined text animation
        this.textAnimationActive = true;
        this.textAnimationStartTime = null;
        this.textYOffset = 30;
        this.textOpacity = 0;

        // Reset current step
        this.currentStep = 0;
        this.tutorialSteps[this.currentStep].setup();
    }

    // Update resetTextAnimations() method
    resetTextAnimations() {
        this.textAnimationActive = true;

        // Start text animation immediately if title animation is complete
        if (!this.titleAnimationActive) {
            this.textAnimationStartTime = millis();
        } else {
            this.textAnimationStartTime = null;
        }

        this.textYOffset = 30;
        this.textOpacity = 0;
    }

    // 初始化ScreenManager覆盖
    initScreenManagerOverride() {
        // 获取ScreenManager的引用
        if (this.screenManager && this.screenManager.constructor) {
            // 保存构造函数的引用
            const ScreenManagerClass = this.screenManager.constructor;

            // 保存原始的changeScreen方法
            const originalChangeScreen = ScreenManagerClass.prototype.changeScreen;

            // 覆盖changeScreen方法
            ScreenManagerClass.prototype.changeScreen = function (newScreen) {
                // 检查是否从Menu跳转到Tutorial
                if (this.currentScreen === this.menuScreen && newScreen === this.stepByStepHelpScreen) {
                    // 重置Tutorial动画
                    this.stepByStepHelpScreen.resetAnimation();
                }

                // 调用原始方法
                originalChangeScreen.call(this, newScreen);
            };
        }
    }
}