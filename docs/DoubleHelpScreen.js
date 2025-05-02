class DoubleHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // Set uniform button sizes
        this.buttonSize = 60;
        this.menuButtonWidth = 100;
        this.menuButtonHeight = 36;

        // Load background image
        this.backgroundImage = loadImage('assets/helpscreen.webp');

        // Load the arrow button images
        this.rightArrowImg = loadImage('assets/right-arrow-button.webp');
        this.leftArrowImg = loadImage('assets/left-arrow-button.webp');
        this.enterButtonImg = loadImage('assets/enter-button.webp');

        this.aButtonImg = loadImage('assets/a-button.webp');
        this.dButtonImg = loadImage('assets/d-button.webp');
        this.spaceButtonImg = loadImage('assets/space-button.webp');
        this.player1Img = loadImage('assets/player1.webp');
        this.player2Img = loadImage('assets/player2.webp');
        this.grassImage = loadImage('assets/hay.webp');

    }


    display() {
        // Draw background image
        if (this.backgroundImage) {
            // Calculate scale to cover the entire screen
            let scale = Math.max(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );

            // Calculate new dimensions
            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;

            // Calculate centered position
            let x = (baseWidth - newWidth) / 2;
            let y = (baseHeight - newHeight) / 2;

            // Draw image to cover the entire screen
            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        // Draw blue border
        stroke(53, 97, 140);
        strokeWeight(10);
        noFill();
        rect(5, 5, baseWidth - 10, baseHeight - 10);  // Leave 5px margin
        noStroke();  // Reset stroke settings

        // Add semi-transparent white overlay
        fill(255, 255, 255, 255 * 0.65);  // White, 65% opacity
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        // Set global text style
        textStyle(BOLD);
        textFont('Comic Sans MS');

        imageMode(CENTER);
        // Display player1 image, maintain aspect ratio
        const player1Scale = 1.2; // Scale factor
        const player1Width = this.buttonSize * player1Scale;
        const player1Height = (this.player1Img.height / this.player1Img.width) * player1Width;
        image(this.player1Img, baseWidth / 4, 120, player1Width, player1Height);

        // Display player2 image, maintain aspect ratio
        const player2Scale = 1.2; // Use same scale factor
        const player2Width = this.buttonSize * player2Scale;
        const player2Height = (this.player2Img.height / this.player2Img.width) * player2Width;
        image(this.player2Img, baseWidth / 4 * 3, 120, player2Width, player2Height);

        image(this.aButtonImg, baseWidth / 8, baseHeight / 6, this.buttonSize, this.buttonSize);
        image(this.dButtonImg, baseWidth / 8 * 3, baseHeight / 6, this.buttonSize, this.buttonSize);
        image(this.spaceButtonImg, baseWidth / 4, 200, this.buttonSize, this.buttonSize);

        image(this.leftArrowImg, baseWidth / 8 * 5, baseHeight / 6, this.buttonSize, this.buttonSize);
        image(this.rightArrowImg, baseWidth / 8 * 7, baseHeight / 6, this.buttonSize, this.buttonSize);
        image(this.enterButtonImg, baseWidth / 4 * 3, 200, this.buttonSize, this.buttonSize);

        textSize(16);
        fill(117, 170, 208);  // Set text color
        textAlign(CENTER, TOP);
        text("MOVE LEFT", baseWidth / 8, baseHeight / 6 + this.buttonSize / 3 * 2);
        text("MOVE RIGHT", baseWidth / 8 * 3, baseHeight / 6 + this.buttonSize / 3 * 2);
        text("PUT DOWN HAY", baseWidth / 4, 200 + this.buttonSize / 3);

        text("MOVE LEFT", baseWidth / 8 * 5, baseHeight / 6 + this.buttonSize / 3 * 2);
        text("MOVE RIGHT", baseWidth / 8 * 7, baseHeight / 6 + this.buttonSize / 3 * 2);
        text("PUT DOWN HAY", baseWidth / 4 * 3, 200 + this.buttonSize / 3);

        // Add border for player1's control area
        stroke(117, 170, 208);  // Light blue color
        strokeWeight(3);      // Bold border
        noFill();            // No fill
        rectMode(CENTER);
        // Calculate border position and size
        const player1BoxX = baseWidth / 4;
        const player1BoxY = baseHeight / 24 + 130;
        const player1BoxWidth = baseWidth / 4 * 1.6;
        const player1BoxHeight = 180;
        rect(player1BoxX, player1BoxY, player1BoxWidth, player1BoxHeight, 10);
        noStroke();

        // Add border for player2's control area
        stroke(117, 170, 208);  // Light blue color
        strokeWeight(3);      // Bold border
        noFill();            // No fill
        rectMode(CENTER);
        // Calculate border position and size
        const player2BoxX = baseWidth / 4 * 3;
        const player2BoxY = baseHeight / 24 + 130;
        const player2BoxWidth = baseWidth / 4 * 1.6;
        const player2BoxHeight = 180;
        rect(player2BoxX, player2BoxY, player2BoxWidth, player2BoxHeight, 10);
        noStroke();

        // Draw hay stack and player using images
        const grassWidth = 42;
        const grassHeight = 28;
        const stackX = baseWidth / 2;
        const stackBaseY = baseHeight / 6 * 5;
        const playerHeight = 105;
        const playerWidth = 70;

        // Calculate total height of hay stack
        const yGap = 3;
        const totalGrassHeight = 6 * (grassHeight - yGap) + yGap;

        // Draw player image first
        const playerY = stackBaseY;
        image(this.player1Img, stackX, playerY, playerWidth, playerHeight);

        // Define random offsets for each hay block
        const offsets = [5, -8, 3, -4, 7, -2];

        // Draw 6 hay blocks, each with random offset
        for (let i = 0; i < 6; i++) {
            image(this.grassImage,
                stackX + offsets[i],
                playerY - playerHeight / 2 - grassHeight / 2 - (i * (grassHeight - yGap)) + 3,
                grassWidth,
                grassHeight
            );
        }

        // Draw blue X on the last hay block
        const topGrassY = playerY - playerHeight / 2 - grassHeight / 2 - (5 * (grassHeight - yGap)) + 3;
        stroke(117, 170, 208);
        strokeWeight(4);
        line(
            stackX + offsets[5] - grassWidth / 2,
            topGrassY - grassHeight / 2,
            stackX + offsets[5] + grassWidth / 2,
            topGrassY + grassHeight / 2
        );
        line(
            stackX + offsets[5] - grassWidth / 2,
            topGrassY + grassHeight / 2,
            stackX + offsets[5] + grassWidth / 2,
            topGrassY - grassHeight / 2
        );
        noStroke();

        // Draw instruction text above the hay stack
        textAlign(CENTER, BOTTOM);
        textSize(18);
        fill(117, 170, 208);  // Use same blue color
        text("Maximum 5 hay stacks at a time", stackX, topGrassY - grassHeight - 10);

        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);
            // Draw button border
            stroke(53, 97, 140);  // Blue-black color
            strokeWeight(3);      // Bold border
            if (isHovered || isFocused) {
                fill(227, 249, 253);  // Brighter button color
            } else {
                fill(207, 239, 246);  // Normal button color
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);
            noStroke();  // Reset stroke settings

            fill(53, 97, 140);  // Button text color
            textSize(14);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }

        // Reset text style
        textStyle(NORMAL);
        textFont('sans-serif');
    }
}