class ScreenManager {
    constructor() {
        this.homeScreen = new HomeScreen(this);
        
        this.single = new Single(this,1,5,30,2000);
        this.menuScreen = new MenuScreen(this);

        this.singleHelpScreen = new SingleHelpScreen(this);
        this.coopHelpScreen = new CoopHelpScreen(this);
        this.pvpHelpScreen = new PvpHelpScreen(this);


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
