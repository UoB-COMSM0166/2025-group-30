/**
 * 屏幕基类
 * 所有游戏界面（如主菜单、游戏界面、暂停界面等）都继承自此类
 * 提供了基本的界面管理功能和必须实现的方法
 */
class Screen {
    /**
     * 构造函数
     * @param {ScreenManager} screenManager - 屏幕管理器实例
     */
    constructor(screenManager) {
        if (new.target === Screen) {
            throw new TypeError("Cannot instantiate an abstract class 'Screen' directly.");
        }
        this.screenManager = screenManager;
    }

    /**
     * 显示界面内容
     * 子类必须实现此方法来绘制具体的界面元素
     */
    display() {
        throw new Error("display() must be implemented by subclass.");
    }

    /**
     * 处理鼠标点击事件
     * 子类可以重写此方法来处理界面的鼠标交互
     */
    mousePressed() {
        //throw new Error("mousePressed() must be implemented by subclass.");
    }
}
