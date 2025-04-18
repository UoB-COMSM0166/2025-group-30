class PvpHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Load the arrow button images
        this.rightArrowImg = loadImage('assets/right-arrow-button.webp');
        this.leftArrowImg = loadImage('assets/left-arrow-button.webp');
        this.enterButtonImg = loadImage('assets/enter-button.webp');

        this.aButtonImg = loadImage('assets/a-button.webp');
        this.dButtonImg = loadImage('assets/d-button.webp');
        this.spaceButtonImg = loadImage('assets/space-button.webp');

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
                    this.screenManager.pvp.restartFromLevel1(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.pvp);
                }
            }
        ];
        this.instructions = "Maximum 5 hay blocks at a time";
    }

    display() {
        background(230);

        const arrowSize = 40;
        const enterButtonSize = 60;
        const spaceButtonSize = 80;

        imageMode(CENTER);
        image(this.aButtonImg, baseWidth / 8, baseHeight / 6, arrowSize, arrowSize);
        image(this.dButtonImg, baseWidth / 8 * 3, baseHeight / 6, arrowSize, arrowSize);
        image(this.spaceButtonImg, baseWidth / 4, 200, spaceButtonSize, spaceButtonSize);

        image(this.leftArrowImg, baseWidth / 8 * 5, baseHeight / 6, arrowSize, arrowSize);
        image(this.rightArrowImg, baseWidth / 8 * 7, baseHeight / 6, arrowSize, arrowSize);
        image(this.enterButtonImg, baseWidth / 4 * 3, 200, enterButtonSize, enterButtonSize);

        textSize(16);
        fill(0);
        textAlign(CENTER, TOP);
        text("MOVE LEFT", baseWidth / 8, baseHeight / 6 + arrowSize / 3 * 2);
        text("MOVE RIGHT", baseWidth / 8 * 3, baseHeight / 6 + arrowSize / 3 * 2);
        text("PUT DOWN HAY", baseWidth / 4, 200 + spaceButtonSize / 3);

        text("MOVE LEFT", baseWidth / 8 * 5, baseHeight / 6 + arrowSize / 3 * 2);
        text("MOVE RIGHT", baseWidth / 8 * 7, baseHeight / 6 + arrowSize / 3 * 2);
        text("PUT DOWN HAY", baseWidth / 4 * 3, 200 + spaceButtonSize / 3);


        textAlign(CENTER, CENTER);
        const instructionsStartY = baseHeight / 2 + 60;
        textSize(22);
        text(this.instructions, baseWidth / 4, instructionsStartY);

        // Draw a visual representation of the maximum stack
        const blockWidth = 40;
        const blockHeight = 30;
        const stackX = baseWidth / 2;
        const stackBaseY = baseHeight / 6 * 5;

        // Draw player platform
        fill(100, 100, 255);
        rectMode(CENTER);
        rect(stackX, stackBaseY - 5, 80, 20);

        // Draw stack of 5 hay blocks
        fill(255, 255, 0);
        for (let i = 0; i < 5; i++) {
            rect(stackX, stackBaseY - (i + 1) * blockHeight, blockWidth, blockHeight);
        }

        // Draw a red X over a 6th block to indicate the limit
        fill(255, 0, 0, 150);
        rect(stackX, stackBaseY - 6 * blockHeight, blockWidth, blockHeight);
        stroke(255, 0, 0);
        strokeWeight(3);
        line(stackX - blockWidth / 2, stackBaseY - 6 * blockHeight - blockHeight / 2,
            stackX + blockWidth / 2, stackBaseY - 6 * blockHeight + blockHeight / 2);
        line(stackX - blockWidth / 2, stackBaseY - 6 * blockHeight + blockHeight / 2,
            stackX + blockWidth / 2, stackBaseY - 6 * blockHeight - blockHeight / 2);
        strokeWeight(1);
        noStroke();


        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth / 2
                && window.mouseXGame <= button.x + button.buttonWidth / 2
                && window.mouseYGame >= button.y - button.buttonHeight / 2
                && window.mouseYGame <= button.y + button.buttonHeight / 2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);

            fill(0);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
}