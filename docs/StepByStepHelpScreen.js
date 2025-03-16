class StepByStepHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        this.buttonWidth = 120;
        this.buttonHeight = 40;

        this.buttons = [
            {
                label: "Back", //only show on first step
                x: baseWidth / 4, 
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Previous",
                x: baseWidth / 4, 
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.previousStep()
            },
            {
                label: "Next",
                x: baseWidth / 4 * 3, 
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.nextStep()
            },
            { 
                label: "Start", //only show on last step
                x: baseWidth / 4 *3, 
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    console.log("start");
                    this.screenManager.changeScreen(this.screenManager.menuScreen)}
            }
        ];

        this.title = "Tutorial";
        
        this.demoPlayer = new Player("middle");
        this.demoPlayer.y = baseHeight/3 * 2; // Position higher for visibility
        
        this.demoBasket = new Basket("left");
        this.demoBasket.y = baseHeight/2;
        this.demoPlayer.basket = this.demoBasket;
        
        // Tutorial steps
        this.currentStep = 0;
        this.tutorialSteps = [
            {
                instruction: "Use LEFT/RIGHT arrow keys to move",
                setup: () => {},
                update: () => {
                    // Handle player movement in the demo
                    if (keyIsDown(LEFT_ARROW)) {
                        this.demoPlayer.dir = -1;
                    } else if (keyIsDown(RIGHT_ARROW)) {
                        this.demoPlayer.dir = 1;
                    } else {
                        this.demoPlayer.dir = 0;
                    }
                    this.demoPlayer.movePlayerWithCaughtGrass();
                },
                draw: () => {
                    // Draw the player
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    // Player has moved left or right
                    return this.playerHasMoved;
                }
            },
            {
                instruction: "Catch the hay block from the sky",
                setup: () => {
                    // Add a falling grass block
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },
                update: () => {
                    // Handle player movement
                    if (keyIsDown(LEFT_ARROW)) {
                        this.demoPlayer.dir = -1;
                    } else if (keyIsDown(RIGHT_ARROW)) {
                        this.demoPlayer.dir = 1;
                    } else {
                        this.demoPlayer.dir = 0;
                    }
                    this.demoPlayer.movePlayerWithCaughtGrass();
                    
                    // Only move the grass if it exists
                    if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();
                        
                        // Check if grass is caught
                        if (this.demoPlayer.checkGrassCaught(this.demoGrass)) {
                            // If grass is caught, don't create a new one
                            this.demoGrass = null;
                        }
                        
                        // If grass falls off screen, create a new one
                        if (this.demoGrass && this.demoGrass.y > baseHeight) {
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10)
                        }
                    }
                },
                draw: () => {
                    // Draw the falling grass if it exists
                    if (this.demoGrass) {
                        this.demoGrass.draw();
                    }
                    
                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    // Player has stacked at least 1 block
                    return this.demoPlayer.stack.length >= 1;
                }
            },
            {
                instruction: `Move to the basket \n press SPACE to empty hay to the basket`,
                setup: () => {
                    this.hasEmptiedToBasket = false;
                },
                update: () => {
                    // Handle player movement
                    if (keyIsDown(LEFT_ARROW)) {
                        this.demoPlayer.dir = -1;
                    } else if (keyIsDown(RIGHT_ARROW)) {
                        this.demoPlayer.dir = 1;
                    } else {
                        this.demoPlayer.dir = 0;
                    }
                    this.demoPlayer.movePlayerWithCaughtGrass();
                    
                    // Check for space key to empty to basket
                    if (keyIsDown(32)) { // 32 is the keyCode for SPACE
                        this.demoPlayer.emptyToBasket();
                        if (this.demoPlayer.stack.length === 0) {
                            this.hasEmptiedToBasket = true;
                        }
                    }
                },
                draw: () => {
                    // Draw the basket
                    this.demoBasket.draw();
                    
                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    // Player has emptied stack to basket
                    return this.hasEmptiedToBasket;
                }
            },
            {
                instruction: "If you stack more than 5 hay blocks, you will lose them all!",
                setup: () => {
                    // Clear the player's stack
                    this.demoPlayer.stack = [];
                    
                    // Add 5 grass blocks to the player's stack
                    for (let i = 0; i < 5; i++) {
                        let grass = new Grass(this.demoPlayer.x + this.demoPlayer.w/2 - 10, 0);
                        grass.y = this.demoPlayer.y - (i+1) * grass.h;
                        this.demoPlayer.stack.push(grass);
                    }
                    
                    // Add one falling grass block to demonstrate exceeding the limit
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },

                update: () => {
                    // Handle player movement
                    if (keyIsDown(LEFT_ARROW)) {
                        this.demoPlayer.dir = -1;
                    } else if (keyIsDown(RIGHT_ARROW)) {
                        this.demoPlayer.dir = 1;
                    } else {
                        this.demoPlayer.dir = 0;
                    }
                    this.demoPlayer.movePlayerWithCaughtGrass();
                     // Only move the grass if it exists
                     if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();
                        
                        // Check if grass is caught
                        if (this.demoPlayer.checkGrassCaught(this.demoGrass)) {
                            // If grass is caught, don't create a new one
                            this.demoGrass = null;
                        }
                        
                        // If grass falls off screen, create a new one
                        if (this.demoGrass && this.demoGrass.y > baseHeight) {
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10)
                        }
                    }
                },
                draw: () => {
                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                    
                    // Draw falling grass if it exists
                    if (this.demoGrass) {
                        this.demoGrass.draw();
                    }
                    
                    // Display stack count and message
                    fill(0);
                    textAlign(LEFT);
                    textSize(20);
                    text(`Stacked blocks: ${this.demoPlayer.stack.length}/5`, 20, 30);
                    
                    // If flashing, show explanation
                    if (!this.demoGrass) {
                        fill(255, 0, 0);
                        textAlign(CENTER);
                        textSize(24);
                        text("Stack exceeded! All blocks dropped!", baseWidth/2, baseHeight/2);
                    }
                },
                checkCompletion: () => {
                    // Player has dropped their stack by exceeding 5 blocks
                    return this.demoPlayer.stack.length === 0 && this.demoPlayer.flash.getFlashDuration() > 0;
                }
            },
            {
                instruction: "You're ready to play! Click 'Start' to select play mode.",
                setup: () => {
                    // No demo needed for final step
                },
                update: () => {
                    // No updates needed
                },
                draw: () => {
                    // No drawing needed
                },
                checkCompletion: () => {
                    // Always complete
                    return true;
                }
            }
        ];
        
        // Initialize the first step
        this.initStep();
        
        // Track if player has moved
        this.playerHasMoved = false;
    }
    
    initStep() {
        // Run the setup function for the current step
        if (this.tutorialSteps[this.currentStep].setup) {
            this.tutorialSteps[this.currentStep].setup();
        }
    }

    previousStep() {
        // Move to the previous tutorial step
        if (this.currentStep > 0) {
            this.currentStep--;
            this.initStep();
        }
    }
    
    nextStep() {
        // Move to the next tutorial step
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.initStep();
        }
    }

    display() {
        background(230);
               
        // Display title
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(0);
        text(this.title, baseWidth/2, baseHeight/8);

        // Display current step instruction
        textSize(24);
        fill(0);
        text(this.tutorialSteps[this.currentStep].instruction, baseWidth/2, baseHeight/4);
        
        // Update and draw the current step
        if (this.tutorialSteps[this.currentStep].update) {
            this.tutorialSteps[this.currentStep].update();
        }
        
        if (this.tutorialSteps[this.currentStep].draw) {
            this.tutorialSteps[this.currentStep].draw();
        }
        
        // Draw buttons
        for (let button of this.buttons){
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth/2 
                && window.mouseXGame <= button.x + this.buttonWidth/2 
                && window.mouseYGame >= button.y - this.buttonHeight/2 
                && window.mouseYGame <= button.y + this.buttonHeight/2;

            if (isHovered) {
                fill(100, 100, 255);
            } else {
                fill(70, 70, 200);
            }
            
            // Only show Next button if not on the last step
            if (button.label === "Next" && this.currentStep >= this.tutorialSteps.length - 1) {
                continue;
            }

            // Only show Previous button if not on the first step
            if (button.label === "Previous" && this.currentStep <= 0) {
                continue;
            }

            // Only show Start button if on the last step
            if (button.label === "Start" && this.currentStep !== this.tutorialSteps.length - 1) {
                continue;
            }

            // Only show Back button if on the first step
            if (button.label === "Back" && this.currentStep !== 0) {
                continue;
            }
            
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight, 10);
            
            fill(255);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
    
    keyPressed() {
        // Track if player has moved for the first step
        if (this.currentStep === 0 && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
            this.playerHasMoved = true;
        }
        
        // Call the parent keyPressed method
        super.keyPressed();
    }
    
    // Override the mousePressed method to respect button visibility conditions
    mousePressed() {
        if (!this.buttons) return;
        for (let button of this.buttons) {
            // Skip buttons that shouldn't be visible based on current step
            if (button.label === "Next" && this.currentStep >= this.tutorialSteps.length - 1) {
                continue;
            }
            if (button.label === "Previous" && this.currentStep <= 0) {
                continue;
            }
            if (button.label === "Start" && this.currentStep !== this.tutorialSteps.length - 1) {
                continue;
            }
            if (button.label === "Back" && this.currentStep !== 0) {
                continue;
            }
            
            // Calculate button click area
            let buttonTop = button.y - button.buttonHeight/2;
            let buttonBottom = button.y + button.buttonHeight/2;
            let buttonLeft = button.x - button.buttonWidth/2;
            let buttonRight = button.x + button.buttonWidth/2;

            // Check if mouse is in button area
            if (window.mouseXGame > buttonLeft && 
                window.mouseXGame < buttonRight && 
                window.mouseYGame > buttonTop && 
                window.mouseYGame < buttonBottom) {
                
                button.action();
                return; // Prevent clicking multiple buttons
            }
        }
    }
}