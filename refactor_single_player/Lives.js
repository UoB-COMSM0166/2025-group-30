/**
 * 生命值管理类
 * 负责处理玩家生命值的增减和状态检查
 */
class Lives {
    /**
     * 初始化生命值系统
     * @param {number} maxLives - 最大生命值
     */
    constructor(maxLives = 3) {
        this.maxLives = maxLives;
        this.currentLives = maxLives;
    }

    /**
     * 减少一点生命值
     * @returns {number} 剩余生命值
     */
    loseLife() {
        if (this.currentLives > 0) {
            this.currentLives--;
        }
        return this.currentLives;
    }

    /**
     * 增加一点生命值
     * @returns {number} 当前生命值
     */
    gainLife() {
        if (this.currentLives < this.maxLives) {
            this.currentLives++;
        }
        return this.currentLives;
    }

    /**
     * 重置生命值到最大值
     */
    reset() {
        this.currentLives = this.maxLives;
    }

    /**
     * 检查是否还有剩余生命
     * @returns {boolean} 是否还有生命
     */
    isAlive() {
        return this.currentLives > 0;
    }

    /**
     * 获取当前生命值
     * @returns {number} 当前生命值
     */
    getLives() {
        return this.currentLives;
    }
} 