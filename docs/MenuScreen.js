class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);

        // 加载背景图片
        this.backgroundImage = null;
        this.backgroundColor = color(190, 240, 230);
        this.loadBackgroundImage();

        // 加载农民疑惑图片
        this.farmerImage = null;
        this.loadFarmerImage();

        // 添加文本浮动效果相关变量，与HomeScreen保持一致
        this.textYOffset = 0;      // 文本Y轴偏移（用于浮现效果）
        this.textFloatSpeed = 0.3; // 浮现速度
        this.textFloatAmount = 5;  // 浮现幅度（像素）

        this.buttons = [
            {
                label: "Single Player",
                x: baseWidth / 2,
                y: baseHeight / 3,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.singleHelpScreen) //go to single help screen
            },
            {
                label: "Co-op Mode",
                x: baseWidth / 2,
                y: baseHeight / 2,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.coopHelpScreen) //go to coop help screen
            },
            {
                label: "PvP Mode",
                x: baseWidth / 2,
                y: baseHeight / 3 * 2,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.pvpHelpScreen) //go to pvp help screen
            },
            {
                label: "Back",
                x: baseWidth / 8, // 左侧位置
                y: baseHeight * 1 / 10, // 上方位置
                buttonWidth: 100,
                buttonHeight: 40,
                isSpecial: true, // 标记特殊按钮
                action: () => this.screenManager.changeScreen(this.screenManager.homeScreen) //go to home screen
            },
            {
                label: "Tutorial",
                x: baseWidth * 7 / 8, // 右侧位置
                y: baseHeight * 1 / 10, // 上方位置
                buttonWidth: 100,
                buttonHeight: 40,
                isSpecial: true, // 标记特殊按钮
                action: () => this.screenManager.changeScreen(this.screenManager.stepByStepHelpScreen) //go to tutorial screen
            }
        ];
    }

    loadBackgroundImage() {
        // 加载背景图片
        loadImage('./assets/MenuScreen.webp', img => {
            this.backgroundImage = img;
        });
    }

    loadFarmerImage() {
        // 加载农民疑惑GIF
        loadImage('./assets/Farmer Confused.gif', img => {
            this.farmerImage = img;
        });
    }

    // 更新文本动画效果，与HomeScreen保持一致
    updateTextAnimation() {
        // 更新浮现动画 - 使文本上下浮动
        this.textYOffset = Math.sin(frameCount * this.textFloatSpeed * 0.05) * this.textFloatAmount;
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

        // 更新文本动画
        this.updateTextAnimation();

        // 标题
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        // 添加文字阴影效果增强可读性
        textStyle(BOLD);
        // 应用浮动效果到标题
        text("Select Game Mode", baseWidth / 2, baseHeight / 5 + this.textYOffset);
        textStyle(NORMAL);

        // 绘制半透明的按钮
        for (let button of this.buttons) {
            rectMode(CENTER);

            // 检查鼠标是否悬停在按钮上
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            // 特殊按钮样式（Back和Tutorial）
            if (button.isSpecial) {
                // 绘制特殊按钮效果
                if (isHovered) {
                    // 悬停效果
                    fill(95, 140, 96, 230);  // 指定的RGB颜色，较高透明度
                    stroke(111, 148, 112, 230); // 新的轮廓颜色，较高透明度
                    strokeWeight(3);
                } else {
                    // 非悬停效果
                    fill(95, 140, 96, 200);  // 指定的RGB颜色，较低透明度
                    stroke(111, 148, 112, 180); // 新的轮廓颜色，较低透明度
                    strokeWeight(2);
                }

                // 绘制特殊按钮形状 - 圆形带边框
                ellipse(button.x, button.y, button.buttonWidth * 0.9, button.buttonHeight * 1.2);

                // 绘制按钮文字 - 特殊样式
                noStroke();
                fill(255, 255, 255, isHovered ? 255 : 220);
                textStyle(BOLD);
                textSize(18);
                textAlign(CENTER, CENTER);
                text(button.label, button.x, button.y);
                textStyle(NORMAL);
            } else {
                // 正常按钮样式（游戏模式按钮）
                // 设置描边
                strokeWeight(2);

                if (isHovered) {
                    // 悬停状态：较亮的半透明效果
                    stroke(255, 255, 255, 200);
                    fill(255, 255, 255, 180);
                } else {
                    // 非悬停状态：较暗的半透明效果
                    stroke(255, 255, 255, 150);
                    fill(255, 255, 255, 120);
                }

                // 计算按钮Y坐标，针对特定按钮应用浮动效果
                let buttonY = button.y;
                if (button.label === "Single Player" || button.label === "Co-op Mode" || button.label === "PvP Mode") {
                    buttonY += this.textYOffset;
                }

                // 绘制圆角矩形按钮，应用浮动效果
                rect(button.x, buttonY, button.buttonWidth, button.buttonHeight, 15);

                // 按钮文字 - 使用深色以便在白色背景上清晰可见
                noStroke();
                if (isHovered) {
                    fill(45, 84, 75, 255); // 悬停时使用指定RGB颜色，完全不透明
                } else {
                    fill(45, 84, 75, 220); // 非悬停状态使用指定RGB颜色，稍微透明
                }
                textSize(20);
                textAlign(CENTER, CENTER);
                // 绘制按钮文本，应用相同的浮动效果
                text(button.label, button.x, buttonY);
            }
        }

        // 绘制农民疑惑图片和指向Tutorial的虚线弯箭头
        if (this.farmerImage) {
            // 找到Tutorial按钮
            const tutorialButton = this.buttons.find(button => button.label === "Tutorial");
            if (tutorialButton) {
                // 设置图片位置（Tutorial按钮右上角）
                const imageSize = 120;
                const imageX = tutorialButton.x - tutorialButton.buttonWidth * 0.8;
                const imageY = tutorialButton.y + tutorialButton.buttonHeight * 1.5;

                // 先绘制箭头（放在底层）
                push(); // 保存当前绘图状态

                // 设置虚线样式
                stroke(255, 255, 255, 200);
                strokeWeight(2);
                drawingContext.setLineDash([5, 5]); // 设置虚线模式

                // 计算控制点 - 从图片中心指向按钮
                const startX = imageX + imageSize / 2;
                const startY = imageY;
                const endX = tutorialButton.x;
                const endY = tutorialButton.y + tutorialButton.buttonHeight / 2;
                const ctrlX = (startX + endX) / 2; // 控制点X坐标
                const ctrlY = (startY + endY) / 2 - 30; // 控制点Y坐标（向上偏移）

                // 绘制弯曲的虚线路径
                noFill();
                beginShape();
                vertex(startX, startY);
                quadraticVertex(ctrlX, ctrlY, endX, endY);
                endShape();

                // 绘制箭头
                const angle = atan2(endY - ctrlY, endX - ctrlX);
                const arrowSize = 10;

                // 绘制实心箭头
                fill(255, 255, 255, 200);
                noStroke();
                push();
                translate(endX, endY);
                rotate(angle);
                triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
                pop();

                // 重置虚线设置
                drawingContext.setLineDash([]);
                pop(); // 恢复绘图状态

                // 然后再绘制图片（放在顶层）
                image(this.farmerImage, imageX - imageSize / 2, imageY - imageSize / 2, imageSize, imageSize);
            }
        }
    }


}