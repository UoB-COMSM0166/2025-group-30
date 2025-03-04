/**
 * 草块类
 * 负责处理草块的显示、移动和状态控制
 */
class Grass {
    /**
     * 初始化草块
     * @param {number} x - 草块的X坐标
     * @param {number} y - 草块的Y坐标
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = { x: 60, y: 40 };  // 草块尺寸
        this.speed = 4;                 // 下落速度
        this.baseHeight = 600;          // 游戏画面高度
        this.isPaused = false;          // 暂停状态
    }

    /**
     * 处理草块下落
     */
    fall() {
        if (!this.isPaused) {
            this.y += this.speed;
        }
    }

    /**
     * 显示草块
     */
    show() {
        noStroke();
        fill(0, 255, 0);  // 绿色
        rect(this.x, this.y, this.size.x, this.size.y);
    }
    
    /**
     * 暂停草块下落
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * 恢复草块下落
     */
    resume() {
        this.isPaused = false;
    }
}
