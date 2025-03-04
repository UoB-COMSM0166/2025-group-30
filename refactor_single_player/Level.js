/**
 * 关卡管理类
 * 负责管理游戏关卡的难度、目标和参数设置
 */
class Level {
    /**
     * 初始化关卡管理器
     * @param {number} level - 初始关卡数
     */
    constructor(level = 1) {
        this.currentLevel = level;
        this.maxLevel = 3;               // 最大关卡数
        this.baseGrassDropDelay = 2000;  // 基础草块生成间隔（毫秒）
        this.baseTargetScore = 10;       // 基础目标分数
        this.baseTimer = 30;             // 基础关卡时间（秒）
        
        this.updateLevelParams();
    }

    /**
     * 更新当前关卡参数
     * 根据关卡数调整游戏难度
     */
    updateLevelParams() {
        // 草块生成间隔随关卡递减
        this.grassDropDelay = this.baseGrassDropDelay - (this.currentLevel - 1) * 500;
        this.grassDropDelay = Math.max(500, this.grassDropDelay);
        
        // 目标分数随关卡递增
        this.targetScore = this.baseTargetScore + (this.currentLevel - 1) * 5;
        
        // 关卡时间保持不变
        this.timer = this.baseTimer;
    }

    /**
     * 尝试进入下一关
     * @returns {boolean} 是否成功进入下一关
     */
    levelUp() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.updateLevelParams();
            return true;
        }
        return false;
    }

    /**
     * 重置到第一关
     */
    resetToFirstLevel() {
        this.currentLevel = 1;
        this.updateLevelParams();
    }

    /**
     * 重置当前关卡参数
     * 保持关卡数不变
     */
    resetCurrentLevel() {
        this.updateLevelParams();
    }

    /**
     * 获取当前关卡信息
     * @returns {Object} 包含关卡号、草块生成间隔、目标分数和时间的对象
     */
    getCurrentLevelInfo() {
        return {
            level: this.currentLevel,
            grassDropDelay: this.grassDropDelay,
            targetScore: this.targetScore,
            timer: this.timer
        };
    }

    /**
     * 检查是否是最后一关
     * @returns {boolean} 是否是最后一关
     */
    isLastLevel() {
        return this.currentLevel >= this.maxLevel;
    }
} 