class ScreenManager {
    constructor() {
        this.homeScreen = new HomeScreen(this);
        
        this.single = new Single(this);
        this.menuScreen = new MenuScreen(this);

        // 创建单一的Help类实例，替代所有的HelpScreen类
        this.helpScreen = new Help(this);

        //this.levelSuccessScreen = new LevelSuccessScreen(this);
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
