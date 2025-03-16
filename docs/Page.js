class Page {
    constructor() {
        this.xPadding = 0;
        this.yPadding = 0;
        this.margin = 25;
        this.gameScale = 1;
        this.baseWidth = 800;  // 基础宽度
        this.baseHeight = 600; // 基础高度
        this.pageHeight = this.baseHeight;
        this.pageWidth = this.baseWidth;
        this.canvas = null;

        // 初始化全局坐标变量
        window.mouseXGame = 0;
        window.mouseYGame = 0;

        // 初始化画布和界面设置
        this.setPageSize();
        this.setPadding();
        this.setCanvas();
        
        // 确保在初始化时调用一次setupMouseCoordinates
        this.setupMouseCoordinates();
        
        // 添加窗口大小变化的事件监听
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setPageSize() {
        // 计算最大尺寸
        let maxWidth = window.innerWidth - this.margin * 2;
        let maxHeight = window.innerHeight - this.margin * 2;

        // 保持4:3比例计算尺寸
        let widthBasedHeight = maxWidth * 3 / 4;
        let heightBasedWidth = maxHeight * 4 / 3;

        // 使用限制维度
        if (widthBasedHeight <= maxHeight) {
            this.pageWidth = maxWidth;
            this.pageHeight = widthBasedHeight;
        } else {
            this.pageHeight = maxHeight;
            this.pageWidth = heightBasedWidth;
        }

        // 计算缩放比例
        this.gameScale = this.pageWidth / this.baseWidth;
    }

    setPadding() {
        this.xPadding = (window.innerWidth - this.pageWidth - this.margin * 2) / 2;
        this.yPadding = (window.innerHeight - this.pageHeight - this.margin * 2) / 2;
    }

    setCanvas() {
        if (this.canvas) {
            // 如果画布已存在，仅调整大小和位置
            resizeCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
        } else {
            // 首次创建画布 - 全局createCanvas方法会返回一个p5.Renderer对象
            this.canvas = createCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
        }
    }

    // 处理窗口大小变化
    handleResize() {
        this.setPageSize();
        this.setPadding();
        this.setCanvas();
        this.setupMouseCoordinates(); // 确保坐标更新
    }

    // 调整游戏缩放比例
    adjustGameScale() {
        let oldScale = this.gameScale;
        this.setPageSize();
        this.setPadding();
        this.setCanvas();
        return this.gameScale / oldScale;
    }

    // 转换实际鼠标坐标到游戏坐标
    scaleToGame(x, y) {
        return {
            x: (x - this.xPadding - this.margin) / this.gameScale,
            y: (y - this.yPadding - this.margin) / this.gameScale
        };
    }

    // 转换游戏坐标到实际屏幕坐标
    scaleToScreen(x, y) {
        return {
            x: x * this.gameScale + this.xPadding + this.margin,
            y: y * this.gameScale + this.yPadding + this.margin
        };
    }
    
    // 应用坐标变换
    applyTransformation() {
        // 设置缩放
        scale(this.gameScale);
    }
    
    // 设置鼠标坐标转换，在mousePressed等函数调用前使用
    setupMouseCoordinates() {
        // 确保mouseX和mouseY在canvas范围内
        if (this.canvas) {
            // 计算鼠标在canvas中的相对位置
            let mx = mouseX;
            let my = mouseY;
            
            // 如果鼠标在canvas内，转换为游戏坐标
            if (mx >= 0 && mx <= width && my >= 0 && my <= height) {
                // 将坐标赋给全局变量，方便其他类使用
                window.mouseXGame =  mx / this.gameScale;
                window.mouseYGame = my / this.gameScale;
            }
        }
    }
    
    // 添加transformCoordinates方法，将屏幕坐标转换为游戏坐标
    transformCoordinates(screenX, screenY) { //not used 
        // 转换为游戏内坐标系
        return {
            x: screenX / this.gameScale,
            y: screenY / this.gameScale
        };
    }
} 