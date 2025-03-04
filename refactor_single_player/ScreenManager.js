/**
 * 屏幕管理器类
 * 负责管理和切换游戏中的所有界面
 * 包括主菜单、游戏界面、暂停界面等
 */
class ScreenManager {
    /**
     * 初始化屏幕管理器
     * 创建所有需要的界面实例并设置初始界面
     */
    constructor() {
        // 存储页面管理器引用
        this.page = window.page;
        
        // 初始化主要游戏界面
        this.homeScreen = new HomeScreen(this);    // 主菜单界面
        this.single = new Single(this);           // 单人模式界面
        this.coop = new Coop(this);              // 合作模式界面
        this.pvp = new Pvp(this);                // 对战模式界面
        this.menuScreen = new MenuScreen(this);   // 菜单界面

        // 初始化帮助界面
        this.helpScreen = new Help(this);
        
        // 初始化结果界面
        this.pvpResultScreen = new PvpResultScreen(this);      // 对战结果界面
        this.levelSuccessScreen = new LevelSuccessScreen(this); // 关卡成功界面
        this.gameOverScreen = new GameOverScreen(this);        // 游戏结束界面
        
        // 初始化暂停界面
        this.pauseScreen = new Pause(this);

        // 设置初始界面为主菜单
        this.currentScreen = this.homeScreen;
        this.lastScreen = null;
    }

    /**
     * 切换当前显示的界面
     * @param {Screen} screen - 要切换到的目标界面
     */
    changeScreen(screen) {
        this.lastScreen = this.currentScreen;
        this.currentScreen = screen;
    }

    /**
     * 显示当前界面的内容
     */
    display() {
        // 确保每次显示前都应用了正确的坐标变换
        this.currentScreen.display();
    }

    /**
     * 处理鼠标点击事件
     */
    mousePressed() {
        // 确保使用游戏坐标系下的鼠标位置
        this.currentScreen.mousePressed();
    }

    /**
     * 处理键盘按下事件
     */
    keyPressed() {
        this.currentScreen.keyPressed(); 
    }

    /**
     * 处理键盘释放事件
     */
    keyReleased() {
        this.currentScreen.keyReleased(); 
    }
}
