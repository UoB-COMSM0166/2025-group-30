class StepByStepHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // 添加背景图片和颜色变量
        this.backgroundImage = null;
        this.backgroundColor = color(230); // 默认背景色
        this.loadBackgroundImage(); // 加载背景图片
        // 添加按钮相关变量
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // 添加标题动画相关变量
        this.titleFinalSize = 34;      // 标题最终字体大小
        this.titleCurrentSize = 0;     // 标题当前字体大小（初始为0）
        this.titleAnimationActive = true; // 标题动画是否激活
        this.titleAnimationStartTime = null;  // 标题动画开始时间
        this.titleAnimationDuration = 1500;   // 标题动画持续时间（1.5秒）
        
        // 添加进度文本浮动动画相关变量
        this.progressTextYOffset = 30;         // 进度文本初始Y偏移量
        this.progressAnimationActive = true;   // 进度文本动画是否激活
        this.progressAnimationStartTime = null; // 进度文本动画开始时间
        this.progressAnimationDuration = 800;  // 进度文本动画持续时间（0.8秒）
        this.progressOpacity = 0;              // 进度文本透明度
        
        // 添加指令文本浮动动画相关变量
        this.instructionTextYOffset = 30;         // 指令文本初始Y偏移量
        this.instructionAnimationActive = false;  // 指令文本动画默认不激活
        this.instructionAnimationStartTime = null; // 指令文本动画开始时间
        this.instructionAnimationDuration = 800;  // 指令文本动画持续时间（0.8秒）
        this.instructionOpacity = 0;              // 指令文本透明度

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
                x: baseWidth / 4 *3, 
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.currentStep = 0;
                    this.demoPlayer.stack = [];
                    this.screenManager.changeScreen(this.screenManager.menuScreen)}
            }
        ];

        this.title = "Tutorial";
        
        this.demoPlayer = new Player("middle");
        this.demoPlayer.y = baseHeight/3 * 2; // Position higher for visibility
        
        this.demoBasket = new Basket("left");
        this.demoBasket.y = baseHeight/2;
        this.demoPlayer.basket = this.demoBasket;
        
       // Tutorial steps
       this.currentStep = 0;
       this.tutorialSteps = [
           { //step 1
               instruction: "Press ← or → keys to move",
               setup: () => { this.demoPlayer.stack = [];},
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
                       if (this.demoPlayer.checkGrassCaught(this.demoGrass)) {
                           // If grass is caught, don't create a new one
                           this.demoGrass = null;
                       }
                       
                       // If grass falls off screen, create a new one
                       if (this.demoGrass && this.demoGrass.y > baseHeight) {
                           this.demoGrass = new Grass(random(200, baseWidth - 100), 10)
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
                   if (this.demoPlayer.stack.length === 1){return;}
                   // put a grass block in the player's stack
                   this.demoGrass = new Grass();
                   this.demoGrass.x = this.demoPlayer.x + this.demoPlayer.w/2 - this.demoGrass.w/2;
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
                       grass.x = random(this.demoPlayer.x + this.demoPlayer.w/4 - 20, this.demoPlayer.x + this.demoPlayer.w/4 + 20);
                       grass.y = this.demoPlayer.y - (i+1) * grass.h;
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
                       if (this.demoPlayer.checkGrassCaught(this.demoGrass)) {
                           // If grass is caught, don't create a new one
                           this.demoGrass = null;
                       }
                       
                       // If grass falls off screen, create a new one
                       if (this.demoGrass && this.demoGrass.y > baseHeight) {
                           this.demoGrass = new Grass(random(200, baseWidth - 100), 10)
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
                       fill(255, 0, 0);
                       textAlign(CENTER);
                       textSize(24);
                       text("Stack exceeded! All blocks dropped!", baseWidth/2, baseHeight/2);
                   }
               },
               checkCompletion: () => {
                   if (this.demoPlayer.flash.getFlashDuration >0) {
                       return true;
                   }
                   return false;
               }
           },
           { //step 4
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
   
    }

    // 加载背景图片方法
    loadBackgroundImage() {
        // 加载背景图片
        loadImage('../Assets/background3.webp', img => {
            this.backgroundImage = img;
            
            // 获取图片左上角的颜色，用于背景
            this.backgroundImage.loadPixels();
            if (this.backgroundImage.pixels && this.backgroundImage.pixels.length > 0) {
                this.backgroundColor = this.backgroundImage.get(0, 0);
            }
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
                
                // 标题动画完成后，启动进度文本动画
                if (this.progressAnimationStartTime === null) {
                    this.progressAnimationStartTime = millis();
                }
            }
        } else {
            // 如果动画未激活，使用最终大小
            this.titleCurrentSize = this.titleFinalSize;
        }
    }
    
    // 更新进度文本浮动动画
    updateProgressAnimation() {
        // 只有当标题动画完成后，才开始进度文本动画
        if (!this.titleAnimationActive && this.progressAnimationActive) {
            // 确保进度文本动画开始时间已初始化
            if (this.progressAnimationStartTime === null) {
                this.progressAnimationStartTime = millis();
            }
            
            // 计算当前动画进度（0-1之间）
            const currentTime = millis();
            const elapsedTime = currentTime - this.progressAnimationStartTime;
            const progress = constrain(elapsedTime / this.progressAnimationDuration, 0, 1);
            
            // 使用缓动函数使动画更自然
            const easedProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果
            
            // 更新当前Y偏移和透明度
            this.progressTextYOffset = 30 * (1 - easedProgress); // 从30像素偏移逐渐减小到0
            this.progressOpacity = 255 * easedProgress;      // 透明度从0渐变到255
            
            // 检查动画是否完成
            if (progress >= 1) {
                this.progressAnimationActive = false;
                this.progressTextYOffset = 0;
                this.progressOpacity = 255;
                
                // 进度文本动画完成后，启动指令文本动画
                this.instructionAnimationActive = true;
                this.instructionAnimationStartTime = millis();
            }
        } else if (!this.progressAnimationActive) {
            // 如果动画未激活或已完成，使用最终值
            this.progressTextYOffset = 0;
            this.progressOpacity = 255;
        }
    }
    
    // 更新指令文本浮动动画
    updateInstructionAnimation() {
        // 只有当进度文本动画完成后，才开始指令文本动画
        if (!this.progressAnimationActive && this.instructionAnimationActive) {
            // 确保指令文本动画开始时间已初始化
            if (this.instructionAnimationStartTime === null) {
                this.instructionAnimationStartTime = millis();
            }
            
            // 计算当前动画进度（0-1之间）
            const currentTime = millis();
            const elapsedTime = currentTime - this.instructionAnimationStartTime;
            const progress = constrain(elapsedTime / this.instructionAnimationDuration, 0, 1);
            
            // 使用缓动函数使动画更自然
            const easedProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果
            
            // 更新当前Y偏移和透明度
            this.instructionTextYOffset = 30 * (1 - easedProgress); // 从30像素偏移逐渐减小到0
            this.instructionOpacity = 255 * easedProgress;      // 透明度从0渐变到255
            
            // 检查动画是否完成
            if (progress >= 1) {
                this.instructionAnimationActive = false;
                this.instructionTextYOffset = 0;
                this.instructionOpacity = 255;
            }
        } else if (!this.instructionAnimationActive && !this.progressAnimationActive) {
            // 如果动画未激活或已完成，使用最终值
            this.instructionTextYOffset = 0;
            this.instructionOpacity = 255;
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
        // 设置背景色 - 使用图片左上角的颜色
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
               
        // 更新所有动画
        this.updateTitleAnimation();
        this.updateProgressAnimation();
        this.updateInstructionAnimation();
        
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
            text(this.title, baseWidth/2 + 1.5, baseHeight/8 + 1.5); // 减小阴影偏移
            
            // 再绘制白色文本
            fill(255, 255, 255);
            text(this.title, baseWidth/2, baseHeight/8);
        }
        
        // 重置为默认字体和样式
        textFont("sans-serif");
        textStyle(NORMAL);

        // 显示进度文本，无论标题动画是否完成
        textSize(16);
        fill(95, 140, 96, this.progressOpacity); // 应用进度文本动画透明度
        text(`Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`, 
            baseWidth/2, 
            baseHeight/8 + 40 + this.progressTextYOffset); // 应用进度文本Y轴偏移

        // 只有当进度文本动画完成后才显示指令文本
        if (!this.progressAnimationActive) {
            // 绘制半透明背景条，增强指令可读性
            noStroke();
            fill(255, 255, 255, this.instructionOpacity * 0.6 / 255); // 半透明白色，应用指令动画透明度
            rectMode(CENTER);
            rect(baseWidth / 2, 
                baseHeight/4 + this.instructionTextYOffset, 
                baseWidth * 0.8, 
                40, 
                15); // 圆角矩形，应用指令文本Y轴偏移

            // Display current step instruction - 使用更加协调的颜色，应用浮动效果
            textSize(18);
            fill(45, 84, 75, this.instructionOpacity); // 应用指令动画透明度
            textStyle(ITALIC);
            text(this.tutorialSteps[this.currentStep].instruction, 
                baseWidth/2, 
                baseHeight/4 + this.instructionTextYOffset); // 应用指令文本Y轴偏移
            textStyle(NORMAL);
        }
     
        // 只有当所有动画完成后才更新和绘制教程步骤内容
        if (!this.titleAnimationActive && !this.progressAnimationActive && !this.instructionAnimationActive) {
            // Update and draw the current step
            this.tutorialSteps[this.currentStep].update();
            this.tutorialSteps[this.currentStep].draw();
        }
        
        // Draw buttons
        for (let button of this.buttons){
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth/2 
                && window.mouseXGame <= button.x + this.buttonWidth/2 
                && window.mouseYGame >= button.y - this.buttonHeight/2 
                && window.mouseYGame <= button.y + this.buttonHeight/2;

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
            let buttonTop = button.y - button.buttonHeight/2;
            let buttonBottom = button.y + button.buttonHeight/2;
            let buttonLeft = button.x - button.buttonWidth/2;
            let buttonRight = button.x + button.buttonWidth/2;

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

    // 重置动画状态 - 在界面重新进入时调用
    resetAnimation() {
        // 重置标题动画
        this.titleAnimationActive = true;
        this.titleAnimationStartTime = null;
        this.titleCurrentSize = 0;
        
        // 重置进度文本动画
        this.progressAnimationActive = true;
        this.progressAnimationStartTime = null;
        this.progressTextYOffset = 30;
        this.progressOpacity = 0;
        
        // 重置指令文本动画
        this.instructionAnimationActive = false; // 初始不激活
        this.instructionAnimationStartTime = null;
        this.instructionTextYOffset = 30;
        this.instructionOpacity = 0;
        
        // 重新初始化当前步骤
        this.currentStep = 0;
        this.tutorialSteps[this.currentStep].setup();
    }

    // 添加新方法：只重置文本动画状态（进度文本和指令文本）
    resetTextAnimations() {
        // 重置进度文本动画
        this.progressAnimationActive = true;
        
        // 只有当标题动画已完成时，才立即开始进度文本动画
        if (!this.titleAnimationActive) {
            this.progressAnimationStartTime = millis(); // 立即开始进度文本动画
        } else {
            this.progressAnimationStartTime = null; // 等待标题动画完成后再开始
        }
        
        this.progressTextYOffset = 30;
        this.progressOpacity = 0;
        
        // 重置指令文本动画（但不立即激活）
        this.instructionAnimationActive = false; 
        this.instructionAnimationStartTime = null;
        this.instructionTextYOffset = 30;
        this.instructionOpacity = 0;
    }
    
    // 更新当前步骤逻辑（与动画状态无关）
    updateCurrentStep() {
        // 只有当所有文本动画都完成后，才更新步骤逻辑
        if (!this.titleAnimationActive && !this.progressAnimationActive && !this.instructionAnimationActive) {
            this.tutorialSteps[this.currentStep].update();
        }
    }
    
    // 渲染当前步骤内容（与动画状态无关）
    renderCurrentStep() {
        // 只有当所有文本动画都完成后，才渲染步骤内容
        if (!this.titleAnimationActive && !this.progressAnimationActive && !this.instructionAnimationActive) {
            this.tutorialSteps[this.currentStep].draw();
        }
    }
}

// 覆盖原有的changeScreen方法以捕获从Menu到Tutorial的转换
const originalChangeScreen = ScreenManager.prototype.changeScreen;
ScreenManager.prototype.changeScreen = function(newScreen) {
    // 检查是否从Menu跳转到Tutorial
    if (this.currentScreen === this.menuScreen && newScreen === this.stepByStepHelpScreen) {
        // 重置Tutorial动画
        this.stepByStepHelpScreen.resetAnimation();
    }
    
    // 调用原始方法
    originalChangeScreen.call(this, newScreen);
};
    