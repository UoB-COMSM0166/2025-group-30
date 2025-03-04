class ScreenManager {
    constructor() {
        // 存储外部引用的页面管理器
        this.page = window.page;
        
        // 初始化各个屏幕
        this.homeScreen = new HomeScreen(this);
        this.single = new Single(this);
        this.coop = new Coop(this);
        this.menuScreen = new MenuScreen(this);

        // 创建单一的Help类实例，替代所有的HelpScreen类
        this.helpScreen = new Help(this);
        
        // 初始化PvP结果屏幕（在pvp之前）
        this.pvpResultScreen = new PvpResultScreen(this);
        
        // 初始化PvP模式（必须在pvpResultScreen之后）
        this.pvp = new Pvp(this);

        // 设置默认屏幕为主屏幕
        this.currentScreen = this.homeScreen;
        this.lastScreen = null;
    }

    changeScreen(screen) {
        this.lastScreen = this.currentScreen;
        this.currentScreen = screen;
    }

    display() {
        // 确保每次显示前都应用了正确的坐标变换
        this.currentScreen.display();
    }

    mousePressed() {
        // 确保使用游戏坐标系下的鼠标位置
        this.currentScreen.mousePressed();
    }

    keyPressed() {
        this.currentScreen.keyPressed(); 
    }

    keyReleased() {
        this.currentScreen.keyReleased(); 
    }
}
