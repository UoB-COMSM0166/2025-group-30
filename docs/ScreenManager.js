class ScreenManager {
    constructor() {
        this.homeScreen = new HomeScreen(this);      
        this.menuScreen = new MenuScreen(this);
        
        this.stepByStepHelpScreen = new StepByStepHelpScreen(this);
        this.singleHelpScreen = new SingleHelpScreen(this);
        this.coopHelpScreen = new CoopHelpScreen(this);
        this.pvpHelpScreen = new PvpHelpScreen(this);

        this.single = new Single(this);
        this.pvp = new Pvp(this);
        this.coop = new Coop(this);

        this.currentScreen = this.homeScreen; //home screen is the default current
    }

    changeScreen(screen) {
        this.currentScreen = screen;
    }

    display() {
        this.currentScreen.display();
    }

    mousePressed() {
        this.currentScreen.mousePressed();
    }

    keyPressed() {
        this.currentScreen.keyPressed(); 
    }

    keyReleased() {
        this.currentScreen.keyReleased(); 
    }

    // Handle visibility change (tab switching)
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden (user switched tabs)
            if (this.currentScreen === this.single && this.single.levelTimerInterval !== null) {
                this.changeScreen(this.single.pauseScreen);
            } else if (this.currentScreen === this.pvp && this.pvp.levelTimerInterval !== null) {
                this.changeScreen(this.pvp.pauseScreen);
            } else if (this.currentScreen === this.coop && this.coop.levelTimerInterval !== null) {
                this.changeScreen(this.coop.pauseScreen);
            }
        }
    }
}
