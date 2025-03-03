class ScreenManager {
    constructor() {
        this.homeScreen = new HomeScreen(this);      
        this.menuScreen = new MenuScreen(this);

        this.singleHelpScreen = new SingleHelpScreen(this);
        this.coopHelpScreen = new CoopHelpScreen(this);
        this.pvpHelpScreen = new PvpHelpScreen(this);

        this.single = new Single(this);
        this.pvp = new Pvp(this);

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
}
