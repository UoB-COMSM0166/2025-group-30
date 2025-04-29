class StepByStepHelpScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);

        // Add background image and color variables
        this.backgroundImage = null;
        this.backgroundColor = color(222, 234, 235); // Default background color
        this.loadBackgroundImage(); // Load background image
        // Add warning icon
        this.warningIcon = null;
        this.loadWarningIcon(); // Load warning icon
        // Add button related variables
        this.buttonWidth = 120;
        this.buttonHeight = 40;

        // Add title animation related variables
        this.titleFinalSize = 34;      // Final font size for title
        this.titleCurrentSize = 0;     // Current font size for title (initial 0)
        this.titleAnimationActive = true; // Whether title animation is active
        this.titleAnimationStartTime = null;  // Title animation start time
        this.titleAnimationDuration = 1000;   // Title animation duration (1 second)

        // Replace separate progress and instruction animation variables with combined text animation variables
        this.textYOffset = 30;         // Text initial Y offset
        this.textAnimationActive = true;   // Text animation active state
        this.textAnimationStartTime = null; // Text animation start time
        this.textAnimationDuration = 500;  // Text animation duration (0.8s)
        this.textOpacity = 0;              // Text opacity

        this.buttons = [
            {
                label: "Back", //only show on first step
                x: baseWidth / 8,
                y: baseHeight / 8,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Previous",
                x: baseWidth / 8,
                y: baseHeight / 8,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.previousStep()
            },
            {
                label: "Next",
                x: baseWidth * 7/8,
                y: baseHeight / 8,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => this.nextStep()
            },
            {
                label: "Start", //only show on last step
                x: baseWidth * 7/8,
                y: baseHeight / 8,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    this.currentStep = 0;
                    this.demoPlayer.stack = [];
                    this.screenManager.changeScreen(this.screenManager.menuScreen);
                }
            }
        ];

        this.title = "Tutorial";

        this.demoPlayer = new Player("middle");
        this.demoPlayer.y = baseHeight - 150; // Adjust to match actual game height

        this.demoBasket = new Basket("left");
        this.demoBasket.y = baseHeight - this.demoBasket.h; // Align basket bottom with screen bottom
        this.demoPlayer.basket = this.demoBasket;

        // Tutorial steps
        this.currentStep = 0;
        this.tutorialSteps = [
            { //step 1
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
            { //step 2
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
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
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
            { //step 3
                instruction: "Press SPACE when near the basket to empty your stack",
                setup: () => {
                    // Reset basket score
                    this.demoBasket.score = 0;
                    this.demoPlayer.score = 0;
                    
                    if (this.demoPlayer.stack.length === 1) { return; }
                    const yGap = 3; // Use consistent gap for all grass blocks
                    // put a grass block in the player's stack
                    this.demoGrass = new Grass();
                    this.demoGrass.x = this.demoPlayer.x + this.demoPlayer.w / 2 - this.demoGrass.w / 2;
                    this.demoGrass.y = this.demoPlayer.y - this.demoGrass.h + yGap;
                    this.demoPlayer.stack = [this.demoGrass];
                },
                update: () => {
                    // Handle player movement
                    this.handlePlayerMovement();

                    // Check for space key to empty to basket
                    if (keyIsDown(32)) { // 32 is the keyCode for SPACE
                        this.demoPlayer.emptyToBasket();
                        this.demoBasket.score = this.demoPlayer.score;
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
            { //step 4
                instruction: `Catch one more hay block to exceed the limit of 5`,
                setup: () => {
                    // Clear the player's stack
                    this.demoPlayer.stack = [];
                    const yGap = 3; // Use consistent gap for all grass blocks

                    // Add 5 grass blocks to the player's stack
                    for (let i = 0; i < 5; i++) {
                        let grass = new Grass();
                        //create a staggered stack of grass blocks
                        grass.x = random(this.demoPlayer.x + this.demoPlayer.w / 4 - 20, this.demoPlayer.x + this.demoPlayer.w / 4 + 20);
                        grass.y = this.demoPlayer.y - (i + 1) * (grass.h - yGap);
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
                            this.demoGrass = new Grass(random(200, baseWidth - 100), 10);
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
                        // Draw white transparent background box
                        rectMode(CENTER);
                        noStroke();
                        fill(255, 255, 255, 180); // White semi-transparent
                        rect(baseWidth / 2, baseHeight / 2, 500, 60, 15); // Rounded rectangle

                        // Set text color
                        fill(141, 74, 44);
                        textAlign(CENTER);
                        textSize(24);

                        // If warning icon is loaded, show icon and text
                        if (this.warningIcon) {
                            // Enlarge icon size
                            const iconSize = 50;

                            // Draw icon on the left side of background box
                            image(this.warningIcon, baseWidth / 2 - 230, baseHeight / 2 - iconSize / 2, iconSize, iconSize);

                            // Draw text on the right side of icon
                            textAlign(LEFT);
                            text("Stack exceeded! All blocks dropped!", baseWidth / 2 - 170, baseHeight / 2 + 8);
                        } else {
                            // If icon is not loaded yet, only show text
                            text("Stack exceeded! All blocks dropped!", baseWidth / 2, baseHeight / 2);
                        }
                    }
                },
                checkCompletion: () => {
                    if (this.demoPlayer.flash.getFlashDuration > 0) {
                        return true;
                    }
                    return false;
                }
            },
            { //step 5
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

        // Initialize ScreenManager override
        this.initScreenManagerOverride();
    }

    // Load background image method
    loadBackgroundImage() {
        // Load background image
        loadImage('./assets/tutorial.avif', img => {
            this.backgroundImage = img;
        });
    }

    // Load warning icon method
    loadWarningIcon() {
        // Load warning icon
        loadImage('./assets/warning.gif', img => {
            this.warningIcon = img;
        });
    }

    // Update title animation
    updateTitleAnimation() {
        if (this.titleAnimationActive) {
            // Initialize animation start time
            if (this.titleAnimationStartTime === null) {
                this.titleAnimationStartTime = millis();
            }

            // Calculate current animation progress (0-1)
            const currentTime = millis();
            const elapsedTime = currentTime - this.titleAnimationStartTime;
            const progress = constrain(elapsedTime / this.titleAnimationDuration, 0, 1);

            // Use easing function for smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out effect

            // Update current font size
            this.titleCurrentSize = this.titleFinalSize * easedProgress;

            // Check if animation is complete
            if (progress >= 1) {
                this.titleAnimationActive = false;
                this.titleCurrentSize = this.titleFinalSize;

                // After title animation completes, start text animation
                if (this.textAnimationStartTime === null) {
                    this.textAnimationStartTime = millis();
                }
            }
        } else {
            // If animation is not active, use final size
            this.titleCurrentSize = this.titleFinalSize;
        }
    }

    // Replace both updateProgressAnimation and updateInstructionAnimation with single method
    updateTextAnimation() {
        // Only start text animation after title animation is complete
        if (!this.titleAnimationActive && this.textAnimationActive) {
            // Initialize animation start time
            if (this.textAnimationStartTime === null) {
                this.textAnimationStartTime = millis();
            }

            // Calculate current animation progress (0-1)
            const currentTime = millis();
            const elapsedTime = currentTime - this.textAnimationStartTime;
            const progress = constrain(elapsedTime / this.textAnimationDuration, 0, 1);

            // Use easing function for smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out

            // Update Y offset and opacity for both texts simultaneously
            this.textYOffset = 30 * (1 - easedProgress);
            this.textOpacity = 255 * easedProgress;

            // Check if animation is complete
            if (progress >= 1) {
                this.textAnimationActive = false;
                this.textYOffset = 0;
                this.textOpacity = 255;
            }
        } else if (!this.textAnimationActive) {
            // If animation is inactive or complete, use final values
            this.textYOffset = 0;
            this.textOpacity = 255;
        }
    }

    previousStep() {
        // Move to the previous tutorial step
        if (this.currentStep > 0) {
            this.currentStep--;
            this.tutorialSteps[this.currentStep].setup();
            // Reset text animation when switching steps
            this.resetTextAnimations();
        }
    }

    nextStep() {
        // Move to the next tutorial step
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.currentStep++;
            this.tutorialSteps[this.currentStep].setup();
            // Reset text animation when switching steps
            this.resetTextAnimations();
        }
    }

    display() {
        // Set background color - use default color set in constructor
        background(this.backgroundColor);

        // Display background image, bottom aligned
        if (this.backgroundImage) {
            // Calculate scale to make image fully cover the screen
            let scale = Math.max(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );

            // Calculate new dimensions
            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;

            // Calculate center position
            let x = (baseWidth - newWidth) / 2;
            let y = (baseHeight - newHeight) / 2;

            // Draw image, fully covering the screen
            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        // Update all animations
        this.updateTitleAnimation();
        this.updateTextAnimation();

        // Display title - use cartoon style font, white text and specified color shadow
        textAlign(CENTER, CENTER);
        textSize(this.titleCurrentSize); // Use animated size

        // Set cartoon style font
        textFont("Comic Sans MS, Chalkboard, Marker Felt, sans-serif");

        // Only draw text when font size is greater than 0 (avoid flickering at animation start)
        if (this.titleCurrentSize > 1) {
            // Draw shadow first for 3D effect
            fill(255, 255, 255, 200); // White semi-transparent
            textStyle(BOLD);
            text(this.title, baseWidth / 2 + 1.5, baseHeight / 8 + 1.5); // Reduce shadow offset

            // Draw text
            fill(255, 255, 255); // Pure white
            text(this.title, baseWidth / 2, baseHeight / 8);
        }

        // Reset to default font and style
        textFont("sans-serif");
        textStyle(NORMAL);

        // Display progress text and instruction text with the same animation
        // Add background box for combined text
        if (this.textOpacity > 0) { // Only show background box when text starts to appear
            noStroke();
            fill(255, 255, 255, 180); // White semi-transparent background
            rectMode(CENTER);
            // Calculate combined box height and position
            const boxHeight = 80; // Reduced height
            const boxY = (baseHeight / 8 + 40 + baseHeight / 4) / 2 + this.textYOffset; // Middle position of two texts
            rect(baseWidth / 2, boxY, 450, boxHeight, 15); // Rounded rectangle background
        }

        textSize(16);
        fill(141, 74, 44, this.textOpacity);
        text(`Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`,
            baseWidth / 2,
            baseHeight / 8 + 40 + this.textYOffset);

        // Display instruction text
        textSize(18);
        fill(141, 74, 44, this.textOpacity);
        textStyle(ITALIC);
        text(this.tutorialSteps[this.currentStep].instruction,
            baseWidth / 2,
            baseHeight / 4 + this.textYOffset);
        textStyle(NORMAL);

        // Only update and draw tutorial step content after all animations complete
        if (!this.titleAnimationActive && !this.textAnimationActive) {
            // Update and draw the current step
            this.tutorialSteps[this.currentStep].update();
            this.tutorialSteps[this.currentStep].draw();
        }

        // Draw buttons
        for (let button of this.buttons) {
            rectMode(CENTER);

            // Check if mouse is hovering over button
            let isHovered = window.mouseXGame >= button.x - this.buttonWidth / 2
                && window.mouseXGame <= button.x + this.buttonWidth / 2
                && window.mouseYGame >= button.y - this.buttonHeight / 2
                && window.mouseYGame <= button.y + this.buttonHeight / 2;

            // Set button style - use green color scheme similar to menu screen
            strokeWeight(2);
            if (isHovered) {
                // Hover state
                stroke(200, 140, 80, 230);
                fill(255, 240, 220, 230);
            } else {
                // Non-hover state
                stroke(200, 140, 80, 180);
                fill(255, 240, 220, 200);
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

            // Draw rounded rectangle button
            rect(button.x, button.y, this.buttonWidth, this.buttonHeight, 10);

            // Button text
            noStroke();
            fill(141, 74, 44, isHovered ? 255 : 220);
            textSize(16);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
            textStyle(NORMAL);
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

    // Update resetAnimation() method
    resetAnimation() {
        // Reset title animation
        this.titleAnimationActive = true;
        this.titleAnimationStartTime = null;
        this.titleCurrentSize = 0;

        // Reset combined text animation
        this.textAnimationActive = true;
        this.textAnimationStartTime = null;
        this.textYOffset = 30;
        this.textOpacity = 0;

        // Reset current step
        this.currentStep = 0;
        this.tutorialSteps[this.currentStep].setup();
    }

    // Update resetTextAnimations() method
    resetTextAnimations() {
        this.textAnimationActive = true;

        // Start text animation immediately if title animation is complete
        if (!this.titleAnimationActive) {
            this.textAnimationStartTime = millis();
        } else {
            this.textAnimationStartTime = null;
        }

        this.textYOffset = 30;
        this.textOpacity = 0;
    }

    // Initialize ScreenManager override
    initScreenManagerOverride() {
        // Get reference to ScreenManager
        if (this.screenManager && this.screenManager.constructor) {
            // Save reference to constructor
            const ScreenManagerClass = this.screenManager.constructor;

            // Save original changeScreen method
            const originalChangeScreen = ScreenManagerClass.prototype.changeScreen;

            // Override changeScreen method
            ScreenManagerClass.prototype.changeScreen = function (newScreen) {
                // Check if switching from Menu to Tutorial
                if (this.currentScreen === this.menuScreen && newScreen === this.stepByStepHelpScreen) {
                    // Reset Tutorial animation
                    this.stepByStepHelpScreen.resetAnimation();
                }

                // Call original method
                originalChangeScreen.call(this, newScreen);
            };
        }
    }
}