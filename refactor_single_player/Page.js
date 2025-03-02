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

        this.setPageSize();
        this.setPadding();
        this.setCanvas();
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
        this.canvas = createCanvas(this.pageWidth, this.pageHeight);
        this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
    }

    adjustGameScale() {
        let oldScale = this.gameScale;
        this.setPageSize();
        this.setPadding();
        return this.gameScale / oldScale;
    }

    // 转换实际坐标到游戏坐标
    scaleToGame(x, y) {
        return {
            x: (x - this.xPadding - this.margin) / this.gameScale,
            y: (y - this.yPadding - this.margin) / this.gameScale
        };
    }

    // 转换游戏坐标到实际坐标
    scaleToScreen(x, y) {
        return {
            x: x * this.gameScale,
            y: y * this.gameScale
        };
    }
} 