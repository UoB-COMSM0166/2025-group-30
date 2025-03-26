class SingleHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Load the arrow button images
        this.rightArrowImg = loadImage('assets/right-arrow-button.webp');
        this.leftArrowImg = loadImage('assets/left-arrow-button.webp');
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
                    this.screenManager.single.resetToLevel1(); //reset single to level 1
                    this.screenManager.changeScreen(this.screenManager.single.targetScoreScreen); 
                }
            }
        ];

        this.instructions = "Maximum 5 hay blocks at a time";
    }

    display() { 
        background(230);

        const arrowSize = 60;
        const spaceButtonSize = 120;
        
        imageMode(CENTER);
        image(this.leftArrowImg, baseWidth/4  , baseHeight/6, arrowSize, arrowSize);
        image(this.rightArrowImg, baseWidth/4 * 3, baseHeight/6, arrowSize, arrowSize);
        image(this.spaceButtonImg, baseWidth/2, baseHeight/2 + 100, spaceButtonSize, spaceButtonSize);
        
        textSize(20);
        fill(0);
        textAlign(CENTER, TOP);
        text("MOVE LEFT", baseWidth/4  , baseHeight/6 + arrowSize/3*2);
        text("MOVE RIGHT", baseWidth/4 * 3, baseHeight/6 + arrowSize / 3*2);
        text("PUT DOWN HAY", baseWidth/2, baseHeight/2 + 100 + spaceButtonSize/3);

    
        textAlign(CENTER, CENTER);
        const instructionsStartY = baseHeight/2 - 60;
        textSize(22);
        text(this.instructions, baseWidth/2, instructionsStartY);
        
        // Draw a visual representation of the maximum stack
        const blockWidth = 40;
        const blockHeight = 30;
        const stackX = baseWidth/4 *3;
        const stackBaseY = baseHeight/2 + 100;
        
        // Draw player platform
        fill(100, 100, 255);
        rectMode(CENTER);
        rect(stackX, stackBaseY -5, 80, 20);
        
        // Draw stack of 5 hay blocks
        fill(255, 255, 0);
        for (let i = 0; i < 5; i++) {
            rect(stackX, stackBaseY -(i+1) * blockHeight, blockWidth, blockHeight);
        }
        
        // Draw a red X over a 6th block to indicate the limit
        fill(255, 0, 0, 150);
        rect(stackX, stackBaseY - 6 * blockHeight, blockWidth, blockHeight);
        stroke(255, 0, 0);
        strokeWeight(3);
        line(stackX - blockWidth/2, stackBaseY - 6 * blockHeight - blockHeight/2, 
             stackX + blockWidth/2, stackBaseY - 6 * blockHeight + blockHeight/2);
        line(stackX - blockWidth/2, stackBaseY - 6 * blockHeight + blockHeight/2, 
             stackX + blockWidth/2, stackBaseY - 6 * blockHeight - blockHeight/2);
        strokeWeight(1);
        noStroke();
        
       

        for (let button of this.buttons){
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight,10);
            
            fill(0);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
}