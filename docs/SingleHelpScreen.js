class SingleHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Load background image
        this.backgroundImage = loadImage('assets/helpscreen.webp');

        // Load the arrow button images
        this.rightArrowImg = loadImage('assets/right-arrow-button.webp');
        this.leftArrowImg = loadImage('assets/left-arrow-button.webp');
        this.spaceButtonImg = loadImage('assets/space-button.webp');

        // Load player and hay images
        this.playerImage = loadImage('assets/player1.webp');
        this.hayImage = loadImage('assets/hay.webp');

        this.buttons = [
            {
                label: "Back",
                x: baseWidth / 6,
                y: baseHeight / 8 * 7,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Start",
                x: baseWidth / 6 * 5,
                y: baseHeight / 8 * 7,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.screenManager.single.restartFromLevel1(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.single.targetScoreScreen);
                }
            }
        ];

        this.instructions = "Maximum 5 hay blocks at a time";
    }

    display() {
        // Draw background image
        image(this.backgroundImage, 0, 0, baseWidth, baseHeight);

        // Draw blue border
        stroke(53, 97, 140);
        strokeWeight(10);
        noFill();
        rect(5, 5, baseWidth - 10, baseHeight - 10);  // Leave 5px margin
        noStroke();  // Reset stroke settings

        // Add semi-transparent white overlay
        fill(255, 255, 255, 255 * 0.65);  // White with 65% opacity
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);

        const arrowSize = 60;
        const spaceButtonSize = arrowSize;  // Make space button same size as arrow buttons

        // Set global text style
        textStyle(BOLD);
        textFont('Comic Sans MS');

        imageMode(CENTER);
        image(this.leftArrowImg, baseWidth / 4, baseHeight / 6, arrowSize, arrowSize);
        image(this.rightArrowImg, baseWidth / 4 * 3, baseHeight / 6, arrowSize, arrowSize);
        image(this.spaceButtonImg, baseWidth / 2, baseHeight / 6, spaceButtonSize, spaceButtonSize);

        textSize(20);
        fill(117, 170, 208);  // Set text color
        textAlign(CENTER, TOP);
        const textY = baseHeight / 6 + arrowSize / 3 * 2;  // Unify text Y coordinate
        text("MOVE LEFT", baseWidth / 4, textY);
        text("MOVE RIGHT", baseWidth / 4 * 3, textY);
        text("PUT DOWN HAY", baseWidth / 2, textY);

        // Draw a visual representation of the maximum stack
        const hayWidth = 42;
        const hayHeight = 28;
        const stackX = baseWidth / 2;  // Center X coordinate
        const stackBaseY = baseHeight / 2 + 120;  // Move down 120 pixels
        const playerHeight = 105;
        const playerWidth = 70;

        // Calculate total height of hay stack
        const yGap = 3;
        const totalHayHeight = 6 * (hayHeight - yGap) + yGap;

        // Draw player image first
        const playerY = stackBaseY;
        image(this.playerImage, stackX, playerY, playerWidth, playerHeight);

        // Define random offsets for each hay block
        const offsets = [5, -8, 3, -4, 7, -2];  // Small random offsets

        // Draw stack of 6 hay blocks right above the player with random offsets
        for (let i = 0; i < 6; i++) {
            image(this.hayImage,
                stackX + offsets[i],
                playerY - playerHeight / 2 - hayHeight / 2 - (i * (hayHeight - yGap)) + 3,
                hayWidth,
                hayHeight
            );
        }

        // Draw a blue X over the top hay block
        const topHayY = playerY - playerHeight / 2 - hayHeight / 2 - (5 * (hayHeight - yGap)) + 3;
        stroke(117, 170, 208);  // Use same blue color
        strokeWeight(4);  // Set line thickness
        // Draw X
        line(
            stackX + offsets[5] - hayWidth / 2,
            topHayY - hayHeight / 2,
            stackX + offsets[5] + hayWidth / 2,
            topHayY + hayHeight / 2
        );
        line(
            stackX + offsets[5] - hayWidth / 2,
            topHayY + hayHeight / 2,
            stackX + offsets[5] + hayWidth / 2,
            topHayY - hayHeight / 2
        );
        noStroke();  // Reset stroke settings

        // Draw instructions text next to the top hay block
        textAlign(LEFT, CENTER);
        textSize(22);
        const textX = stackX + hayWidth + 50;  // Move text more to the right
        text("Maximum 5 hay stacks", textX, topHayY - 15);
        text("at a time", textX, topHayY + 15);

        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            let isFocused = this.focusedButtonIndex === this.buttons.indexOf(button);


            stroke(53, 97, 140);
            strokeWeight(3);
            if (isHovered) {
                fill(227, 249, 253);
            } else {
                fill(207, 239, 246);
            }
            if (isFocused) {
                stroke(14, 105, 218);
                strokeWeight(5);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);
            noStroke();

            // Draw text
            textSize(16);
            textAlign(CENTER, CENTER);
            fill(53, 97, 140);
            text(button.label, button.x, button.y);
        }

        // Reset text style at the end of display
        textStyle(NORMAL);
        textFont('sans-serif');
    }
}