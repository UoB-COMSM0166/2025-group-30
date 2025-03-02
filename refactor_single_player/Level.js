class Level {
    constructor(level = 1) {
        this.currentLevel = level;
        this.maxLevel = 3; // 最大关卡数
        this.baseGrassDropDelay = 2000; // 基础掉落延迟（毫秒）
        this.baseTargetScore = 10; // 基础目标分数
        this.baseTimer = 30; // 基础时间（秒）
        
        // 更新当前关卡参数
        this.updateLevelParams();
    }

    updateLevelParams() {
        // 随关卡提升，草块掉落速度变快（延迟减少）
        this.grassDropDelay = this.baseGrassDropDelay - (this.currentLevel - 1) * 500;
        // 确保最小延迟不低于500毫秒
        this.grassDropDelay = Math.max(500, this.grassDropDelay);
        
        // 目标分数：第一关10分，每关增加5分
        this.targetScore = this.baseTargetScore + (this.currentLevel - 1) * 5;
        
        // 时间保持不变
        this.timer = this.baseTimer;
    }

    // 尝试进入下一关
    levelUp() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.updateLevelParams();
            return true;
        }
        return false;
    }

    // 重置到第一关
    resetToFirstLevel() {
        this.currentLevel = 1;
        this.updateLevelParams();
    }

    // 重置当前关卡参数（保持关卡数不变）
    resetCurrentLevel() {
        this.updateLevelParams();
    }

    // 获取当前关卡信息
    getCurrentLevelInfo() {
        return {
            level: this.currentLevel,
            grassDropDelay: this.grassDropDelay,
            targetScore: this.targetScore,
            timer: this.timer
        };
    }

    // 检查是否是最后一关
    isLastLevel() {
        return this.currentLevel >= this.maxLevel;
    }
} 