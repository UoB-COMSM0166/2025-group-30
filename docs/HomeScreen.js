class HomeScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // 加载背景GIF和标题图片
        this.backgroundGif = null;
        this.titleImage = null;
        this.backgroundColor = color(205, 238, 226);
        this.gifLoaded = false;  // 追踪GIF是否成功加载
        this.titleLoaded = false;  // 追踪标题图片是否成功加载

        // 文本动画相关变量
        this.textAlpha = 200;      // 文本透明度
        this.textFading = false;   // 文本是否正在淡出
        this.textColor = color(70, 90, 100, this.textAlpha); // 文本颜色：深蓝灰色带透明度
        this.textYOffset = 0;      // 文本Y轴偏移（用于浮现效果）
        this.textFloatSpeed = 0.3; // 浮现速度
        this.textFloatAmount = 5;  // 浮现幅度（像素）
        // 标题图片浮动效果与文本保持一致
        this.titleYOffset = 0;     // 标题Y轴偏移

        // 加载背景GIF和标题图片
        this.loadBackgroundGif();
    }

    loadBackgroundGif() {
        // 加载背景GIF
        loadImage('./assets/HomeScreen.gif', img => {
            this.backgroundGif = img;
            this.gifLoaded = true;
            this.loadTitleImage();
        });
    }

    loadTitleImage() {
        // 加载标题图片
        loadImage('./assets/title.webp', img => {
            this.titleImage = img;
            this.titleLoaded = true;
        });
    }

    // 更新文本动画效果
    updateTextAnimation() {
        // 更新透明度动画 - 使文本透明度在150-250之间呼吸效果
        if (this.textFading) {
            this.textAlpha -= 0.8;
            if (this.textAlpha <= 150) {
                this.textFading = false;
            }
        } else {
            this.textAlpha += 0.8;
            if (this.textAlpha >= 250) {
                this.textFading = true;
            }
        }

        // 更新浮现动画 - 使文本上下浮动
        this.textYOffset = Math.sin(frameCount * this.textFloatSpeed * 0.05) * this.textFloatAmount;
        // 更新标题浮动效果 - 使用相同的浮动速度和幅度
        this.titleYOffset = this.textYOffset;

        // 更新文本颜色的透明度
        this.textColor = color(70, 90, 100, this.textAlpha);
    }

    display() {
        // 使用指定的背景色
        background(this.backgroundColor);

        // 显示背景GIF
        if (this.gifLoaded && this.backgroundGif) {
            // 计算缩放比例，保持GIF比例
            let gifWidth = this.backgroundGif.width;
            let gifHeight = this.backgroundGif.height;

            if (gifWidth > 0 && gifHeight > 0) { // 确保GIF已加载尺寸
                let scale = Math.min(
                    baseWidth / gifWidth,
                    baseHeight / gifHeight
                );

                // 计算水平居中但垂直底部对齐的位置
                let newWidth = gifWidth * scale;
                let newHeight = gifHeight * scale;
                let x = (baseWidth - newWidth) / 2;   // 水平居中
                let y = baseHeight - newHeight;       // 底部对齐

                // 绘制GIF，保持原始比例，底部对齐
                image(this.backgroundGif, x, y, newWidth, newHeight);
            }
        }

        // 显示标题和文本
        if (this.titleLoaded && this.titleImage) {
            // 计算标题位置和尺寸变量
            let titleHeight = 0;
            let titleBottomY = 30; // 默认顶部距离

            // 计算标题居中位置
            const titleWidth = min(this.titleImage.width, baseWidth * 0.8); // 标题最大宽度为画布宽度的80%
            const titleScale = titleWidth / this.titleImage.width;
            titleHeight = this.titleImage.height * titleScale;

            // 在顶部居中显示标题，应用浮动效果
            image(
                this.titleImage,
                (baseWidth - titleWidth) / 2, // 水平居中
                30 + this.titleYOffset, // 顶部距离 + 浮动效果
                titleWidth,
                titleHeight
            );

            // 计算标题底部y坐标，用于放置文本
            titleBottomY = 30 + titleHeight + 30; // 标题顶部距离 + 标题高度 + 间距

            // 更新文本动画
            this.updateTextAnimation();

            // 根据标题位置计算文本位置
            const textY = titleBottomY;

            // 绘制半透明背景条，增强文本可读性
            noStroke();
            fill(255, 255, 255, 60); // 半透明白色
            rectMode(CENTER);
            rect(baseWidth / 2, textY + this.textYOffset, 300, 40, 15); // 圆角矩形，应用浮现效果

            // 绘制"Click anywhere to start"提示，带浮现效果
            textAlign(CENTER, CENTER);
            noStroke();
            fill(this.textColor); // 使用动态颜色

            // 应用浮现动画效果，不使用阴影
            textSize(20);
            textStyle(ITALIC); // 斜体
            text("Click anywhere to start", baseWidth / 2, textY + this.textYOffset);

            // 重置样式
            textStyle(NORMAL);
        }
    }
    doubleClicked() {
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }

    keyPressed() {
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
