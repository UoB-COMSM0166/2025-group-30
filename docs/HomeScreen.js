class HomeScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // Load background GIF and title image
        this.backgroundGif = null;
        this.titleImage = null;
        this.backgroundColor = color(205, 238, 226);
        this.gifLoaded = false;  // Track if GIF is successfully loaded
        this.titleLoaded = false;  // Track if title image is successfully loaded

        // Text animation related variables
        this.textAlpha = 200;      // Text opacity
        this.textFading = false;   // Whether text is fading out
        this.textColor = color(70, 90, 100, this.textAlpha); // Text color: deep blue-gray with opacity
        this.textYOffset = 0;      // Text Y-axis offset (for floating effect)
        this.textFloatSpeed = 0.3; // Floating speed
        this.textFloatAmount = 5;  // Floating amplitude (pixels)
        // Title image floating effect matches text
        this.titleYOffset = 0;     // Title Y-axis offset

        // Load background GIF and title image
        this.loadBackgroundGif();
    }

    loadBackgroundGif() {
        // Load background GIF
        loadImage('./assets/HomeScreen.gif', img => {
            this.backgroundGif = img;
            this.gifLoaded = true;
            this.loadTitleImage();
        });
    }

    loadTitleImage() {
        // Load title image
        loadImage('./assets/title.webp', img => {
            this.titleImage = img;
            this.titleLoaded = true;
        });
    }

    // Update text animation effects
    updateTextAnimation() {
        // Update opacity animation - make text opacity breathe between 150-250
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

        // Update floating animation - make text float up and down
        this.textYOffset = Math.sin(frameCount * this.textFloatSpeed * 0.05) * this.textFloatAmount;
        // Update title floating effect - use same floating speed and amplitude
        this.titleYOffset = this.textYOffset;

        // Update text color opacity
        this.textColor = color(70, 90, 100, this.textAlpha);
    }

    display() {
        // Use specified background color
        background(this.backgroundColor);

        // Display background GIF
        if (this.gifLoaded && this.backgroundGif) {
            // Calculate scale ratio, maintain GIF aspect ratio
            let gifWidth = this.backgroundGif.width;
            let gifHeight = this.backgroundGif.height;

            if (gifWidth > 0 && gifHeight > 0) { // Ensure GIF has loaded dimensions
                let scale = Math.min(
                    baseWidth / gifWidth,
                    baseHeight / gifHeight
                );

                // Calculate horizontally centered but vertically bottom-aligned position
                let newWidth = gifWidth * scale;
                let newHeight = gifHeight * scale;
                let x = (baseWidth - newWidth) / 2;   // Center horizontally
                let y = baseHeight - newHeight;       // Align to bottom

                // Draw GIF, maintain original aspect ratio, bottom-aligned
                image(this.backgroundGif, x, y, newWidth, newHeight);
            }
        }

        // Display title and text
        if (this.titleLoaded && this.titleImage) {
            // Calculate title position and size variables
            let titleHeight = 0;
            let titleBottomY = 30; // Default top margin

            // Calculate title center position
            const titleWidth = min(this.titleImage.width, baseWidth * 0.8); // Title max width is 80% of canvas width
            const titleScale = titleWidth / this.titleImage.width;
            titleHeight = this.titleImage.height * titleScale;

            // Display title centered at top, apply floating effect
            image(
                this.titleImage,
                (baseWidth - titleWidth) / 2, // Center horizontally
                30 + this.titleYOffset, // Top margin + floating effect
                titleWidth,
                titleHeight
            );

            // Calculate title bottom Y coordinate for text placement
            titleBottomY = 30 + titleHeight + 30; // Top margin + title height + spacing

            // Update text animation
            this.updateTextAnimation();

            // Calculate text position based on title position
            const textY = titleBottomY;

            // Draw semi-transparent background bar to enhance text readability
            noStroke();
            fill(255, 255, 255, 60); // Semi-transparent white
            rectMode(CENTER);
            rect(baseWidth / 2, textY + this.textYOffset, 400, 40, 15); // Rounded rectangle with floating effect

            // Draw "Double click or press any key to start" prompt with floating effect
            textAlign(CENTER, CENTER);
            noStroke();
            textFont('Comic Sans MS');
            fill(this.textColor); // Use dynamic color

            // Apply floating animation effect, no shadow
            textSize(20);
            textStyle(ITALIC); // Italic
            text("Double click or press any key to start", baseWidth / 2, textY + this.textYOffset);

            // Reset styles
            textStyle(NORMAL);
            textFont('sans-serif');
        }
    }
    doubleClicked() {
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }

    keyPressed() {
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
