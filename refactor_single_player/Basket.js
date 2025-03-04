/**
 * 篮子类
 * 负责处理草块收集容器的显示和分数更新
 */
class Basket {
    /**
     * 初始化篮子
     * @param {number} x - 篮子的X坐标位置
     */
    constructor(x = 0) {
        // 游戏画面基础尺寸
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // 篮子尺寸和位置
        this.size = { x: 80, y: 100 };
        this.position = { x: x, y: this.baseHeight - 100 };
        this.score = 0; // Store number of collected hay blocks
        this.stats = null;  // 用于存储GameStats引用
    }

    /**
     * 更新篮子收集的草块数量
     * @param {number} collectedGrass - 收集的草块数量
     */
    updateStats(collectedGrass) {
        this.score += collectedGrass; // Update score or hay block count
    }

    /**
     * 显示篮子
     */
    show() {
        fill(165, 42, 42);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    /**
     * 设置游戏统计实例
     * @param {GameStats} stats - 游戏统计实例
     */
    setStats(stats) {
        this.stats = stats;
    }

    /**
     * 更新游戏分数
     * @param {number} points - 要增加的分数
     */
    updateScore(points) {
        if (this.stats) {
            this.stats.addScore(points);
        }
    }
}

