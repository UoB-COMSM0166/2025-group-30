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
        
        console.log("Page initialized with scale:", this.gameScale);
        console.log("Canvas position:", this.xPadding + this.margin, this.yPadding + this.margin);
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
        
        console.log("Page size updated:", this.pageWidth, this.pageHeight, "Scale:", this.gameScale);
    }

    setPadding() {
        this.xPadding = (window.innerWidth - this.pageWidth - this.margin * 2) / 2;
        this.yPadding = (window.innerHeight - this.pageHeight - this.margin * 2) / 2;
        console.log("Padding updated:", this.xPadding, this.yPadding);
    }

    setCanvas() {
        if (this.canvas) {
            // 如果画布已存在，仅调整大小和位置
            resizeCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
            console.log("Canvas resized:", this.pageWidth, this.pageHeight);
        } else {
            // 首次创建画布 - 全局createCanvas方法会返回一个p5.Renderer对象
            this.canvas = createCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
            console.log("Canvas created:", this.pageWidth, this.pageHeight);
        }
    }

    // 处理窗口大小变化
    handleResize() {
        console.log("Window resized");
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
        // p5.js中的mouseX和mouseY已经是相对于画布的坐标
        // 我们只需要去除缩放因子
        window.mouseXGame = mouseX / this.gameScale;
        window.mouseYGame = mouseY / this.gameScale;
        
        // 调试输出
        console.log("Raw mouse coords:", mouseX, mouseY);
        console.log("Game coords:", window.mouseXGame, window.mouseYGame);
        console.log("Scale factor:", this.gameScale);
    }
} 