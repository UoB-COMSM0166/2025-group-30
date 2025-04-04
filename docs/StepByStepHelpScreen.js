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
                x: baseWidth / 4 * 3,
                y: baseHeight / 6 * 5,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.currentStep = 0;
                    this.demoPlayer.stack = [];
                    this.screenManager.changeScreen(this.screenManager.menuScreen)
                }
            }
        ];

        this.title = "Tutorial";

        this.demoPlayer = new Player("middle");
        this.demoPlayer.y = baseHeight / 3 * 2; // Position higher for visibility

        this.demoBasket = new Basket("left");
        this.demoBasket.y = baseHeight / 2;
        this.demoPlayer.basket = this.demoBasket;

        // Tutorial steps
        this.currentStep = 0;
        this.tutorialSteps = [
            { //step 0
                instruction: "Press ← or → keys to move",
                setup: () => { this.demoPlayer.stack = []; },
                update: () => {
                    // Handle player movement in the demo
                    this.handlePlayerMovement();
                },
                draw: () => {
                    // Draw the player
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 1
                instruction: "Move under the falling hay block to catch it",
                setup: () => {
                    this.demoPlayer.stack = [];
                    // Add a falling grass block
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },
                update: () => {
                    // Handle player movement in the demo
                    this.handlePlayerMovement();

                    // Only move the grass if it exists
                    if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();

                        // Check if grass is caught
                        if (this.demoPlayer.catches(this.demoGrass)) {
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
                    if (this.demoPlayer.stack.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 2
                instruction: "Press SPACE when near the basket to empty your stack",
                setup: () => {
                    if (this.demoPlayer.stack.length === 1) { return; }
                    // put a grass block in the player's stack
                    this.demoGrass = new Grass();
                    this.demoGrass.x = this.demoPlayer.x + this.demoPlayer.w / 2 - this.demoGrass.w / 2;
                    this.demoGrass.y = this.demoPlayer.y - this.demoGrass.h;
                    this.demoPlayer.stack = [this.demoGrass];
                },
                update: () => {
                    // Handle player movement
                    this.handlePlayerMovement();

                    // Check for space key to empty to basket
                    if (keyIsDown(32)) { // 32 is the keyCode for SPACE
                        this.demoPlayer.emptyToBasket();
                    }
                },
                draw: () => {
                    // Draw the basket
                    this.demoBasket.draw();

                    // Draw the player with stacked grass
                    this.demoPlayer.drawPlayerWithCaughtGrass();
                },
                checkCompletion: () => {
                    if (this.demoPlayer.stack.length === 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 3
                instruction: `Catch one more hay block to exceed the limit of 5`,
                setup: () => {
                    // Clear the player's stack
                    this.demoPlayer.stack = [];

                    // Add 5 grass blocks to the player's stack
                    for (let i = 0; i < 5; i++) {
                        let grass = new Grass();
                        //create a staggered stack of grass blocks
                        grass.x = random(this.demoPlayer.x + this.demoPlayer.w / 4 - 20, this.demoPlayer.x + this.demoPlayer.w / 4 + 20);
                        grass.y = this.demoPlayer.y - (i + 1) * grass.h;
                        this.demoPlayer.stack.push(grass);
                    }

                    // Add one falling grass block to demonstrate exceeding the limit
                    this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
                },

                update: () => {
                    // Handle player movement
                    this.handlePlayerMovement();
                    // Only move the grass if it exists
                    if (this.demoGrass) {
                        // Move the falling grass
                        this.demoGrass.fall();

                        // Check if grass is caught
                        if (this.demoPlayer.catches(this.demoGrass)) {
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

                    // Display message with emphasized limit
                    textAlign(LEFT);


                    // If flashing, show explanation
                    if (!this.demoGrass) {
                        fill(255, 0, 0);
                        textAlign(CENTER);
                        textSize(24);
                        text("Stack exceeded! All blocks dropped!", baseWidth / 2, baseHeight / 2);
                    }
                },
                checkCompletion: () => {
                    if (this.demoPlayer.flash.getFlashDuration > 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 4
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
                    return true;
                }
            }
        ];

        // Initialize the first step
        this.tutorialSteps[this.currentStep].setup();

    }

    previousStep() {
        // Move to the previous tutorial step
        if (this.currentStep > 0) {
            this.currentStep--;
            this.tutorialSteps[this.currentStep].setup();
        }
    }

    nextStep() {
        // Move to the next tutorial step
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.tutorialSteps[this.currentStep].setup();
        }
    }


    display() {
        background(230);

        // Display title
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(0);
        text(this.title, baseWidth / 2, baseHeight / 8);

        // Display step progress
        textSize(16);
        fill(100, 100, 100);
        text(`Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`, baseWidth / 2, baseHeight / 8 + 40);

        // Display current step instruction
        textSize(18);
        fill(50, 50, 200);
        text(this.tutorialSteps[this.currentStep].instruction, baseWidth / 2, baseHeight / 4);

        // Update and draw the current step
        this.tutorialSteps[this.currentStep].update();
        this.tutorialSteps[this.currentStep].draw();


        // Draw buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth / 2
                && window.mouseXGame <= button.x + this.buttonWidth / 2
                && window.mouseYGame >= button.y - this.buttonHeight / 2
                && window.mouseYGame <= button.y + this.buttonHeight / 2;

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
            let buttonTop = button.y - button.buttonHeight / 2;
            let buttonBottom = button.y + button.buttonHeight / 2;
            let buttonLeft = button.x - button.buttonWidth / 2;
            let buttonRight = button.x + button.buttonWidth / 2;

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

    // Helper function to handle player movement input
    handlePlayerMovement() {
        if (keyIsDown(LEFT_ARROW)) {
            this.demoPlayer.dir = -1;
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.demoPlayer.dir = 1;
        } else {
            this.demoPlayer.dir = 0;
        }
        this.demoPlayer.movePlayerWithCaughtGrass();
    }



}
