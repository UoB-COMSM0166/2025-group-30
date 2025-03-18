class HomeScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        // 加载背景视频和标题图片
        this.backgroundVideo = null;
        this.titleImage = null;
        this.backgroundColor = color(210, 233, 227);  // 使用指定的RGB颜色：(210, 233, 227)
        this.videoLoaded = false;  // 追踪视频是否成功加载
        this.titleLoaded = false;  // 追踪标题图片是否成功加载
        // 文本动画相关变量
        this.textAlpha = 200;      // 文本透明度
        this.textFading = false;   // 文本是否正在淡出
        this.textColor = color(70, 90, 100, this.textAlpha); // 文本颜色：深蓝灰色带透明度
        this.textYOffset = 0;      // 文本Y轴偏移（用于浮现效果）
        this.textFloatSpeed = 0.3; // 浮现速度
        this.textFloatAmount = 5;  // 浮现幅度（像素）
        
        this.loadBackgroundVideo();
        this.loadTitleImage();
    }

    loadBackgroundVideo() {
        try {
            // 创建视频元素
            this.backgroundVideo = createVideo(
                '../Assets/HomeScreen.mp4',
                // 视频加载成功的回调
                () => {
                    this.videoLoaded = true;
                    this.backgroundVideo.loop();  // 设置循环播放
                    this.backgroundVideo.volume(0);  // 静音播放
                    
                    // 在p5.js中，需要主动调用play()来开始播放
                    this.backgroundVideo.play();
                }
            );
            
            this.backgroundVideo.hide();  // 隐藏HTML元素，只在canvas中显示
            
            // 添加错误处理
            this.backgroundVideo.elt.addEventListener('error', (e) => {
                this.videoLoaded = false;
            });
        } catch (e) {
            this.videoLoaded = false;
        }
    }
    
    loadTitleImage() {
        // 加载标题图片
        loadImage('../Assets/title.webp', img => {
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
        
        // 更新文本颜色的透明度
        this.textColor = color(70, 90, 100, this.textAlpha);
    }
    
    display() {
        // 使用指定的背景色
        background(this.backgroundColor);
        
        // 尝试显示视频
        if (this.videoLoaded && this.backgroundVideo) {
            // 检查视频是否暂停，如果是则尝试播放
            if (this.backgroundVideo.elt.paused) {
                this.backgroundVideo.play();
            }
            
            // 计算缩放比例，保持视频比例
            let videoWidth = this.backgroundVideo.width;
            let videoHeight = this.backgroundVideo.height;
            
            if (videoWidth > 0 && videoHeight > 0) { // 确保视频已加载尺寸
                let scale = Math.min(
                    baseWidth / videoWidth,
                    baseHeight / videoHeight
                );
                
                // 计算水平居中但垂直底部对齐的位置
                let newWidth = videoWidth * scale;
                let newHeight = videoHeight * scale;
                let x = (baseWidth - newWidth) / 2;   // 水平居中
                let y = baseHeight - newHeight;       // 底部对齐
                
                // 绘制视频，保持原始比例，底部对齐
                image(this.backgroundVideo, x, y, newWidth, newHeight);
            }
        } else if (!this.videoLoaded && frameCount % 60 === 0) {
            // 每60帧尝试一次重新加载视频
            this.loadBackgroundVideo();
        }

        // 计算标题位置和尺寸变量
        let titleHeight = 0;
        let titleBottomY = 30; // 默认顶部距离
        
        // 显示标题图片在界面顶部
        if (this.titleLoaded && this.titleImage) {
            // 计算标题居中位置
            const titleWidth = min(this.titleImage.width, baseWidth * 0.8); // 标题最大宽度为画布宽度的80%
            const titleScale = titleWidth / this.titleImage.width;
            titleHeight = this.titleImage.height * titleScale;
            
            // 在顶部居中显示标题
            image(
                this.titleImage, 
                (baseWidth - titleWidth) / 2, // 水平居中
                30, // 顶部距离
                titleWidth, 
                titleHeight
            );
            
            // 计算标题底部y坐标，用于放置文本
            titleBottomY = 30 + titleHeight + 30; // 标题顶部距离 + 标题高度 + 间距
        }

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

    mousePressed() {
        // 用户交互时，尝试播放视频（解决一些浏览器的自动播放限制）
        if (this.backgroundVideo && !this.videoLoaded) {
            this.backgroundVideo.play();
            this.videoLoaded = true;
        }
        
        // 切换到菜单屏幕
        this.screenManager.changeScreen(this.screenManager.menuScreen);
        
        // 当离开HomeScreen时暂停视频以节省资源
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
        }
    }
}
