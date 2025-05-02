class MenuScreen extends Screen {

    constructor(screenManager) {
        super(screenManager);

        // Load background image
        this.backgroundImage = null;
        this.backgroundColor = color(190, 240, 230);
        this.loadBackgroundImage();

        // Load farmer confused image
        this.farmerImage = null;
        this.loadFarmerImage();

        // Text floating effect variables
        this.textYOffset = 0;      
        this.textFloatSpeed = 0.3; 
        this.textFloatAmount = 5;  

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
                x: baseWidth / 8, 
                y: baseHeight * 1 / 10, 
                buttonWidth: 100,
                buttonHeight: 40,
                isSpecial: true, 
                action: () => this.screenManager.changeScreen(this.screenManager.homeScreen) //go to home screen
            },
            {
                label: "Tutorial",
                x: baseWidth * 7 / 8, 
                y: baseHeight * 1 / 10, 
                buttonWidth: 100,
                buttonHeight: 40,
                isSpecial: true, 
                action: () => this.screenManager.changeScreen(this.screenManager.stepByStepHelpScreen) //go to tutorial screen
            }
        ];
    }

    loadBackgroundImage() {
        loadImage('./assets/MenuScreen.webp', img => {
            this.backgroundImage = img;
        });
    }

    loadFarmerImage() {
        loadImage('./assets/Farmer Confused.gif', img => {
            this.farmerImage = img;
        });
    }

    // Update text animation effect
    updateTextAnimation() {
        // Update floating animation - make text float up and down
        this.textYOffset = Math.sin(frameCount * this.textFloatSpeed * 0.05) * this.textFloatAmount;
    }

    display() {
        // Set background color - use the color from the top-left corner of the image
        background(this.backgroundColor);

        // Display background image, aligned to bottom
        if (this.backgroundImage) {
            // Calculate scale ratio, maintain image aspect ratio
            let scale = Math.min(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );

            // Calculate position - horizontally centered but vertically bottom-aligned
            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;
            let x = (baseWidth - newWidth) / 2; // Center horizontally
            let y = baseHeight - newHeight;     // Align to bottom

            // Draw image, maintain original aspect ratio, bottom-aligned
            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        // Update text animation
        this.updateTextAnimation();

        // Set global text style
        textFont('Comic Sans MS');
        textStyle(BOLD);

        // Title
        fill(255);
        textSize(30);
        textAlign(CENTER, CENTER);
        // Apply floating effect to title
        text("Select Game Mode", baseWidth / 2, baseHeight / 5 + this.textYOffset);
        textStyle(NORMAL);

        // Draw semi-transparent buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            // Special button style (Back and Tutorial)
            if (button.isSpecial) {
                if (isHovered) {
                    fill(95, 140, 96, 230); 
                    stroke(111, 148, 112, 230); 
                    strokeWeight(3);
                } else {
                    fill(95, 140, 96, 200);
                    stroke(111, 148, 112, 180); 
                    strokeWeight(2);
                }

                ellipse(button.x, button.y, button.buttonWidth * 0.9, button.buttonHeight * 1.2);

                noStroke();
                fill(255, 255, 255, isHovered ? 255 : 220);
                textStyle(BOLD);
                textSize(18);
                textAlign(CENTER, CENTER);
                text(button.label, button.x, button.y);
                textStyle(NORMAL);
            } else {
                // Normal button style (game mode buttons)
                // Set stroke
                strokeWeight(2);

                if (isHovered) {
                    // Hover state: brighter semi-transparent effect
                    stroke(255, 255, 255, 200);
                    fill(255, 255, 255, 180);
                } else {
                    // Non-hover state: darker semi-transparent effect
                    stroke(255, 255, 255, 150);
                    fill(255, 255, 255, 120);
                }

                // Calculate button Y coordinate, apply floating effect to specific buttons
                let buttonY = button.y;
                if (button.label === "Single Player" || button.label === "Co-op Mode" || button.label === "PvP Mode") {
                    buttonY += this.textYOffset;
                }

                rect(button.x, buttonY, button.buttonWidth, button.buttonHeight, 15);

                noStroke();
                if (isHovered) {
                    fill(45, 84, 75, 255);
                } else {
                    fill(45, 84, 75, 220);
                }
                textSize(20);
                textAlign(CENTER, CENTER);
                text(button.label, button.x, buttonY);
            }
        }

        if (this.farmerImage) {
            const tutorialButton = this.buttons.find(button => button.label === "Tutorial");
            if (tutorialButton) {
                const imageSize = 120;
                const imageX = tutorialButton.x - tutorialButton.buttonWidth * 0.8;
                const imageY = tutorialButton.y + tutorialButton.buttonHeight * 1.5;

                push(); 

                stroke(255, 255, 255, 200);
                strokeWeight(2);
                drawingContext.setLineDash([5, 5]); 

                // Calculate control points - from image center to button
                const startX = imageX + imageSize / 2;
                const startY = imageY;
                const endX = tutorialButton.x;
                const endY = tutorialButton.y + tutorialButton.buttonHeight / 2;
                const ctrlX = (startX + endX) / 2; // Control point X coordinate
                const ctrlY = (startY + endY) / 2 - 30; // Control point Y coordinate (offset upward)

                noFill();
                beginShape();
                vertex(startX, startY);
                quadraticVertex(ctrlX, ctrlY, endX, endY);
                endShape();

                const angle = atan2(endY - ctrlY, endX - ctrlX);
                const arrowSize = 10;

                fill(255, 255, 255, 200);
                noStroke();
                push();
                translate(endX, endY);
                rotate(angle);
                triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
                pop();

                drawingContext.setLineDash([]);
                pop();

                image(this.farmerImage, imageX - imageSize / 2, imageY - imageSize / 2, imageSize, imageSize);
            }
        }
    }
}