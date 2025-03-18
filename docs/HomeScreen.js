class HomeScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
        // 加载背景图片
        this.backgroundImage = null;
        // 需要设置默认背景色，因为图片加载是异步的
        // 在图片加载完成前或加载失败时需要有背景色
        this.backgroundColor = color(0, 0, 0, 0); // 默认设置透明背景
        this.loadBackgroundImage();
    }

    loadBackgroundImage() {
        // 使用相对于docs文件夹的路径
        loadImage('../Assets/HomeScreen.gif', img => {
            this.backgroundImage = img;
            
            // 获取图片左上角的颜色
            this.backgroundImage.loadPixels();
            if (this.backgroundImage.pixels && this.backgroundImage.pixels.length > 0) {
                // 获取左上角的像素颜色 (0,0)位置
                this.backgroundColor = this.backgroundImage.get(0, 0);
            }
        }, () => {
            // 加载失败，设置为白色背景
            this.backgroundColor = color(255);
        });
    }

    display() {
        // 使用与图片左上角匹配的背景色
        background(this.backgroundColor);
        
        // 使用加载的背景图片，保持原始比例
        if (this.backgroundImage) {
            // 计算缩放比例，保持图片比例
            let scale = Math.min(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );
            
            // 计算居中位置
            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;
            let x = (baseWidth - newWidth) / 2;
            let y = (baseHeight - newHeight) / 2;
            
            // 绘制图片，保持原始比例
            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        textAlign(CENTER, CENTER);
        fill(0);
        textSize(30);
        text("Welcome to Haystacking!", baseWidth / 2, baseHeight / 3);
        
        textSize(20);
        text("Click anywhere to start", baseWidth / 2, baseHeight / 2);
    }

    mousePressed() { //go to menuscreen
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
