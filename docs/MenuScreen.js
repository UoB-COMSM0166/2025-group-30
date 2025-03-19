class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);
        
        // 加载背景图片
        this.backgroundImage = null;
        this.backgroundColor = color(200); // 默认背景色
        this.loadBackgroundImage();
        
        // 加载农民疑惑图片
        this.farmerImage = null;
        this.loadFarmerImage();
        
        this.buttons = [
            {
                label: "Single Player",
                x : baseWidth / 2, 
                y : baseHeight / 3,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.singleHelpScreen) //go to single help screen
            },
            {
                label: "Co-op Mode",
                x : baseWidth / 2, 
                y : baseHeight / 2,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.coopHelpScreen) //go to coop help screen
            },
            {
                label: "PvP Mode",
                x : baseWidth / 2, 
                y : baseHeight / 3 * 2,
                buttonWidth: 200,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.pvpHelpScreen) //go to pvp help screen
            },
            {
                label: "Back",
                x : baseWidth / 5, 
                y : baseHeight * 7/8,
                buttonWidth: 100,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.homeScreen) //go to settings screen
            },
            {
                label: "Tutorial",
                x : baseWidth / 5 * 4, 
                y : baseHeight * 7/8,
                buttonWidth: 100,
                buttonHeight: 40,
                action: () => this.screenManager.changeScreen(this.screenManager.stepByStepHelpScreen) //go to settings screen
            }
        ];
    }

    loadBackgroundImage() {
        // 加载背景图片
        loadImage('../Assets/MenuScreen.webp', img => {
            this.backgroundImage = img;
            
            // 获取图片左上角的颜色，用于背景
            this.backgroundImage.loadPixels();
            if (this.backgroundImage.pixels && this.backgroundImage.pixels.length > 0) {
                this.backgroundColor = this.backgroundImage.get(0, 0);
            }
        });
    }
    
    loadFarmerImage() {
        // 加载农民疑惑GIF
        loadImage('../Assets/农民疑惑.gif', img => {
            this.farmerImage = img;
        });
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

        // 标题
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        // 添加文字阴影效果增强可读性
        textStyle(BOLD);
        text("Select Game Mode", baseWidth / 2, baseHeight / 5);
        textStyle(NORMAL);

        // 绘制半透明的按钮
        for (let button of this.buttons){
            rectMode(CENTER);
            
            // 检查鼠标是否悬停在按钮上
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;

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
            
            // 绘制圆角矩形按钮
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 15);
            
            // 按钮文字 - 使用深色以便在白色背景上清晰可见
            noStroke();
            if (isHovered) {
                fill(50, 50, 80); // 悬停时文字颜色更深
            } else {
                fill(70, 70, 100); // 普通状态的文字颜色
            }
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        // 绘制农民疑惑图片和指向Tutorial的虚线弯箭头
        if (this.farmerImage) {
            // 找到Tutorial按钮
            const tutorialButton = this.buttons.find(button => button.label === "Tutorial");
            if (tutorialButton) {
                // 设置图片位置（Tutorial按钮右上角）
                const imageSize = 120;
                const imageX = tutorialButton.x + tutorialButton.buttonWidth/2 + imageSize/2;
                const imageY = tutorialButton.y - tutorialButton.buttonHeight/2 - imageSize/2;
                
                // 先绘制箭头（放在底层）
                push(); // 保存当前绘图状态
                
                // 设置虚线样式
                stroke(255, 255, 255, 200);
                strokeWeight(2);
                drawingContext.setLineDash([5, 5]); // 设置虚线模式
                
                // 计算控制点 - 从图片中心指向按钮右上角
                const startX = imageX;
                const startY = imageY;
                const endX = tutorialButton.x + tutorialButton.buttonWidth/2;
                const endY = tutorialButton.y - tutorialButton.buttonHeight/2;
                const ctrlX = (startX + endX) / 2 - 30; // 控制点X坐标（略微向左偏移）
                const ctrlY = (startY + endY) / 2; // 控制点Y坐标（保持中间高度）
                
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
                triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
                pop();
                
                // 重置虚线设置
                drawingContext.setLineDash([]);
                pop(); // 恢复绘图状态
                
                // 然后再绘制图片（放在顶层）
                image(this.farmerImage, imageX - imageSize/2, imageY - imageSize/2, imageSize, imageSize);
            }
        }
    }

    
}