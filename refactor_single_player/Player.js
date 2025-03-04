/**
 * 玩家类
 * 负责处理玩家角色的移动、碰撞检测、草块收集等功能
 */
class Player {
    /**
     * 初始化玩家
     * @param {number} id - 玩家ID：0为单人模式，1为玩家1，2为玩家2
     * @param {string} color - 玩家颜色
     * @param {string} position - 玩家位置：'center'中间，'left'左侧，'right'右侧
     */
    constructor(id = 0, color = 'blue', position = 'center') {
        this.id = id;
        this.color = color;
        this.position = position;
        
        // 玩家基本属性
        this.w = 120;  // 宽度
        this.h = 20;   // 高度
        this.stack = []; // 收集的草块堆叠
        this.maxStack = 5; // 最大堆叠数量
        
        // 移动相关属性
        this.baseMaxSpeed = 15;      // 基础最大速度
        this.baseAcceleration = 1.8; // 基础加速度
        this.friction = 0.8;         // 摩擦系数
        this.minSpeed = 3;           // 最小速度
        this.dir = 0;                // 移动方向
        this.basket = new Basket();  // 篮子实例
        
        // 游戏画面基础尺寸
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // 根据位置设置初始坐标
        if (this.position === 'center') {
            this.x = this.baseWidth / 2 - this.w / 2;
        } else if (this.position === 'left') {
            this.x = this.baseWidth / 4 - this.w / 2;
        } else if (this.position === 'right') {
            this.x = this.baseWidth * 3 / 4 - this.w / 2;
        }
        
        this.baseY = this.baseHeight - 50; // 初始Y坐标
        this.y = this.baseY;
        this.velocity = 0;
        this.acceleration = 0;
        
        // 闪烁和暂停相关属性
        this.isBlinking = false;     // 是否处于闪烁状态
        this.blinkStartTime = 0;     // 闪烁开始时间
        this.blinkDuration = 500;    // 闪烁持续时间（毫秒）
        this.blinkInterval = 100;    // 闪烁间隔（毫秒）
        this.visible = true;         // 闪烁时的可见性
        this.isPaused = false;       // 是否暂停
    }
    
    /**
     * 重置玩家位置和状态
     */
    resetPosition() {
        if (this.position === 'center') {
            this.x = this.baseWidth / 2 - this.w / 2;
        } else if (this.position === 'left') {
            this.x = this.baseWidth / 4 - this.w / 2;
        } else if (this.position === 'right') {
            this.x = this.baseWidth * 3 / 4 - this.w / 2;
        }
        
        this.velocity = 0;
        this.dir = 0;
        this.stack = [];
        this.y = this.baseY;
        this.isBlinking = false;
        this.isPaused = false;
        this.visible = true;
    }

    /**
     * 失去生命时的处理
     * @param {boolean} clearStack - 是否清空草块堆叠
     */
    loseLife(clearStack = false) {
        this.startBlinking();
        this.velocity = 0;
        this.dir = 0;
        if (clearStack) {
            this.stack = [];
        }
    }
    
    /**
     * 开始闪烁效果
     */
    startBlinking() {
        this.isBlinking = true;
        this.isPaused = true;
        this.blinkStartTime = millis();
        this.visible = false;
    }
    
    /**
     * 更新闪烁状态
     */
    updateBlinkState() {
        if (!this.isBlinking) return;
        
        let currentTime = millis();
        let elapsedTime = currentTime - this.blinkStartTime;
        
        if (elapsedTime >= this.blinkDuration) {
            this.isBlinking = false;
            this.isPaused = false;
            this.visible = true;
            return;
        }
        
        this.visible = (Math.floor(elapsedTime / this.blinkInterval) % 2) === 0;
    }

    /**
     * 处理玩家移动
     */
    move() {
        if (this.isPaused) {
            this.updateBlinkState();
            return;
        }
        
        this.updateAcceleration();
        this.updateVelocity();
        
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, this.baseWidth - this.w);
        
        let dx = newX - this.x;
        this.x = newX;
        this.updateStack(dx);
    }
    
    /**
     * 更新加速度
     */
    updateAcceleration() {
        let stackFactor = Math.max(0.4, 1 - (this.stack.length * 0.12));
        let currentAcceleration = this.baseAcceleration * stackFactor;
        
        if (this.dir !== 0) {
            this.acceleration = this.dir * currentAcceleration;
        } else {
            this.acceleration = 0;
        }
    }

    /**
     * 更新速度
     */
    updateVelocity() {
        let stackFactor = Math.max(0.3, 1 - (this.stack.length * 0.15));
        let currentMaxSpeed = this.baseMaxSpeed * stackFactor;
        
        this.velocity += this.acceleration;
        
        if (this.dir === 0) {
            this.velocity *= this.friction;
        }
        
        if (Math.abs(this.velocity) < 0.1) {
            this.velocity = 0;
        }
        
        this.velocity = constrain(this.velocity, -currentMaxSpeed, currentMaxSpeed);
    }

    /**
     * 更新草块堆叠位置
     * @param {number} dx - X轴位移量
     */
    updateStack(dx) {
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    /**
     * 检查与草块的碰撞
     * @param {Grass} grass - 草块对象
     * @returns {boolean} 是否发生碰撞
     */
    checkGrassCollision(grass) {
        let minOverlap = grass.size.x * 0.3;
        
        if (this.stack.length === 0) {
            let catchXStart = this.x;
            let catchXEnd = this.x + this.w;
            
            let overlapStart = Math.max(catchXStart, grass.x);
            let overlapEnd = Math.min(catchXEnd, grass.x + grass.size.x);
            let overlapWidth = overlapEnd - overlapStart;

            if (overlapWidth < minOverlap) return false;

            return (
                grass.y + grass.size.y >= this.y &&
                grass.y + grass.size.y <= this.y + 10
            );
        } else {
            let topGrass = this.stack[this.stack.length - 1];
            let catchXStart = topGrass.x;
            let catchXEnd = topGrass.x + topGrass.size.x;
            
            let overlapStart = Math.max(catchXStart, grass.x);
            let overlapEnd = Math.min(catchXEnd, grass.x + grass.size.x);
            let overlapWidth = overlapEnd - overlapStart;

            if (overlapWidth < minOverlap) return false;

            return (
                grass.y + grass.size.y >= topGrass.y &&
                grass.y + grass.size.y <= topGrass.y + 10
            );
        }
    }

    /**
     * 尝试接住草块
     * @param {Grass} grass - 草块对象
     * @returns {boolean} 是否成功接住
     */
    catchGrass(grass) {
        if (this.checkGrassCollision(grass)) {
            if (this.stack.length >= this.maxStack) {
                this.loseLife();
            } else {
                this.stack.push(grass);
            }
            return true;
        }
        return false;
    }

    /**
     * 尝试将草块放入篮子
     */
    dropGrass() {
        if (!this.basket || this.stack.length === 0) {
            return;
        }

        if (this.x + this.w >= this.basket.position.x && 
            this.x <= this.basket.position.x + this.basket.size.x) {
            let collectedGrass = this.stack.length;
            this.basket.updateScore(collectedGrass);
            this.stack = [];
            this.baseMaxSpeed = 15;
            this.baseAcceleration = 1.8;
        }
    }
    
    /**
     * 绘制玩家
     */
    drawPlayer() {
        this.updateBlinkState();
        
        if (this.visible) {
            fill(this.color);
            rect(this.x, this.y, this.w, this.h);
        }
    }
}





