/**
 * Pause Screen Class
 * Handles the pause menu functionality for all game modes (Single, Coop, PvP)
 */
class Pause extends Screen {
    constructor(screenManager) {
        super(screenManager);
        // Store reference to the screen that was active when game was paused
        this.lastScreen = null;
        
        // Button dimensions and spacing
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.buttonSpacing = 30;
        
        // Fixed game dimensions
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // Array to store button information for click detection
        this.buttons = [];
    }

    /**
     * Sets the reference to the screen that was active when game was paused
     * @param {Screen} screen - The screen to store
     */
    setLastScreen(screen) {
        this.lastScreen = screen;
        this.buttons = []; // Reset buttons to prevent duplicates
    }

    /**
     * Renders the pause menu overlay
     * Shows a semi-transparent background with pause menu options
     */
    display() {
        if (!this.lastScreen) return;
        
        // Keep rendering the game screen in the background
        this.lastScreen.display();
        
        // Draw semi-transparent overlay
        push();
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, this.baseWidth, this.baseHeight);
        
        // Draw pause menu title
        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("PAUSE", this.baseWidth/2, this.baseHeight/2 - 100);
        
        // Draw menu buttons
        this.drawButton("Resume", this.baseWidth/2, this.baseHeight/2, this.resumeGame.bind(this));
        this.drawButton("Restart", this.baseWidth/2, this.baseHeight/2 + this.buttonHeight + this.buttonSpacing, this.restartGame.bind(this));
        this.drawButton("Home", this.baseWidth/2, this.baseHeight/2 + (this.buttonHeight + this.buttonSpacing) * 2, this.returnHome.bind(this));
        pop();
    }
    
    /**
     * Draws an interactive button with hover effect
     * @param {string} label - Button text
     * @param {number} x - X coordinate of button center
     * @param {number} y - Y coordinate of button center
     * @param {Function} callback - Function to call when button is clicked
     */
    drawButton(label, x, y, callback) {
        rectMode(CENTER);
        
        // Get mouse coordinates in game space
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        // Convert mouse coordinates if using page scaling
        if (this.screenManager && this.screenManager.page) {
            mouseXGame = this.screenManager.page.mouseXGame;
            mouseYGame = this.screenManager.page.mouseYGame;
        }
        
        // Check if mouse is hovering over button
        let isHovered = mouseXGame >= x - this.buttonWidth/2 && mouseXGame <= x + this.buttonWidth/2 &&
                       mouseYGame >= y - this.buttonHeight/2 && mouseYGame <= y + this.buttonHeight/2;
        
        // Draw button background with hover effect
        fill(isHovered ? color(100, 100, 255) : color(70, 70, 200));
        rect(x, y, this.buttonWidth, this.buttonHeight, 10);
        
        // Draw button text
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(label, x, y);
        
        // Store button data for click detection if not already stored
        if (!this.buttons.some(btn => btn.label === label)) {
            this.buttons.push({
                label: label,
                x: x,
                y: y,
                width: this.buttonWidth,
                height: this.buttonHeight,
                callback: callback
            });
        }
    }
    
    /**
     * Handles mouse click events on buttons
     */
    mousePressed() {
        if (!this.buttons || this.buttons.length === 0) return;
        
        // Get mouse coordinates in game space
        let mouseXGame = mouseX;
        let mouseYGame = mouseY;
        
        if (this.screenManager && this.screenManager.page) {
            mouseXGame = this.screenManager.page.mouseXGame;
            mouseYGame = this.screenManager.page.mouseYGame;
        }
        
        // Check if any button was clicked
        for (let button of this.buttons) {
            if (mouseXGame >= button.x - button.width/2 && mouseXGame <= button.x + button.width/2 &&
                mouseYGame >= button.y - button.height/2 && mouseYGame <= button.y + button.height/2) {
                button.callback();
                return;
            }
        }
    }
    
    /**
     * Handles keyboard input - ESC key resumes game
     */
    keyPressed() {
        if (keyCode === ESCAPE) {
            this.resumeGame();
        }
    }
    
    /**
     * Resumes the paused game
     */
    resumeGame() {
        if (this.lastScreen) {
            this.lastScreen.resumeGame();
            this.screenManager.changeScreen(this.lastScreen);
        }
    }
    
    /**
     * Restarts the current game mode
     * - For Single/Coop: Retries current level
     * - For PvP: Starts a new game
     */
    restartGame() {
        if (this.lastScreen) {
            if (this.lastScreen instanceof Single || this.lastScreen instanceof Coop) {
                this.screenManager.changeScreen(this.lastScreen);
                this.lastScreen.retryCurrentLevel();
            } else if (this.lastScreen instanceof Pvp) {
                this.screenManager.changeScreen(this.lastScreen);
                this.lastScreen.startNewGame();
            }
        }
    }
    
    /**
     * Returns to the home screen
     * Properly cleans up game state before switching screens
     */
    returnHome() {
        if (this.lastScreen) {
            // Clean up game state based on mode
            if (this.lastScreen instanceof Single || this.lastScreen instanceof Coop) {
                this.lastScreen.retryCurrentLevel();
            } else if (this.lastScreen instanceof Pvp) {
                this.lastScreen.startNewGame();
            }
            
            this.screenManager.changeScreen(this.screenManager.homeScreen);
        }
    }
}
