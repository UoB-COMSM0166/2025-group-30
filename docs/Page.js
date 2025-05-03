class Page {
    constructor() {
        this.xPadding = 0;
        this.yPadding = 0;
        this.margin = 25;
        this.gameScale = 1;
        this.baseWidth = 800;  // Base width
        this.baseHeight = 600; // Base height
        this.pageHeight = this.baseHeight;
        this.pageWidth = this.baseWidth;
        this.canvas = null;

        // Initialize global coordinates
        window.mouseXGame = 0;
        window.mouseYGame = 0;

        // Initialize canvas and UI
        this.setPageSize();
        this.setPadding();
        this.setCanvas();

        // Initial mouse coordinate setup
        this.setupMouseCoordinates();

        // Add window resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setPageSize() {
        // Calculate maximum dimensions
        let maxWidth = window.innerWidth - this.margin * 2;
        let maxHeight = window.innerHeight - this.margin * 2;

        // Calculate dimensions maintaining 4:3 ratio
        let widthBasedHeight = maxWidth * 3 / 4;
        let heightBasedWidth = maxHeight * 4 / 3;

        // Use limiting dimension
        if (widthBasedHeight <= maxHeight) {
            this.pageWidth = maxWidth;
            this.pageHeight = widthBasedHeight;
        } else {
            this.pageHeight = maxHeight;
            this.pageWidth = heightBasedWidth;
        }

        // Calculate scaling factor
        this.gameScale = this.pageWidth / this.baseWidth;
    }

    setPadding() {
        this.xPadding = (window.innerWidth - this.pageWidth - this.margin * 2) / 2;
        this.yPadding = (window.innerHeight - this.pageHeight - this.margin * 2) / 2;
    }

    setCanvas() {
        if (this.canvas) {
            // Resize existing canvas
            resizeCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
        } else {
            // Create new canvas
            this.canvas = createCanvas(this.pageWidth, this.pageHeight);
            this.canvas.position(this.xPadding + this.margin, this.yPadding + this.margin);
        }
    }

    // Handle window resize
    handleResize() {
        this.setPageSize();
        this.setPadding();
        this.setCanvas();
        this.setupMouseCoordinates(); // Ensure coordinates are updated
    }

    // Adjust game scaling factor
    adjustGameScale() {
        let oldScale = this.gameScale;
        this.setPageSize();
        this.setPadding();
        this.setCanvas();
        return this.gameScale / oldScale;
    }

    // Convert actual mouse coordinates to game coordinates
    scaleToGame(x, y) {
        return {
            x: (x - this.xPadding - this.margin) / this.gameScale,
            y: (y - this.yPadding - this.margin) / this.gameScale
        };
    }

    // Convert game coordinates to actual screen coordinates
    scaleToScreen(x, y) {
        return {
            x: x * this.gameScale + this.xPadding + this.margin,
            y: y * this.gameScale + this.yPadding + this.margin
        };
    }

    // Apply coordinate transformation
    applyTransformation() {
        // Set scaling
        scale(this.gameScale);
    }

    // Set mouse coordinate conversion, use before calling mousePressed etc.
    setupMouseCoordinates() {
        if (this.canvas) {
            let mx = mouseX;
            let my = mouseY;

            // Convert to game coordinates if within canvas
            if (mx >= 0 && mx <= width && my >= 0 && my <= height) {
                window.mouseXGame = mx / this.gameScale;
                window.mouseYGame = my / this.gameScale;
            }
        }
    }

    // Convert screen coordinates to game coordinates
    transformCoordinates(screenX, screenY) { //not used 
        return {
            x: screenX / this.gameScale,
            y: screenY / this.gameScale
        };
    }
} 