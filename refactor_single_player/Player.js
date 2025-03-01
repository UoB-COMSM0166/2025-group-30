class Player {
    constructor() {
        this.w = 120; 
        this.h = 20;
        this.stack = []; // Stack for caught grass
        this.maxStack = 5; // Maximum grass stack size
        this.baseMaxSpeed = 15; // 基础最大速度
        this.baseAcceleration = 1.8; // 基础加速度
        this.friction = 0.92; // 摩擦力系数
        this.minSpeed = 3;
        this.lives = 3;
        this.dir = 0;
        this.basket = new Basket(); // 初始化篮子

        this.x = width / 2;
        this.baseY = height - 50; // 记录初始 Y 位置
        this.y = this.baseY; // 玩家将始终保持在这个高度
        this.velocity = 0;
        this.acceleration = 0;
    }
    
    resetPosition() {
        this.x = width / 2;
        this.velocity = 0;
        this.dir = 0;
        this.stack = []; // 清空堆叠的草块
        this.y = this.baseY; // 复位 Y 位置
    }


    loseLife() {
        this.lives--;
        console.log(`Player lost a life! Lives remaining: ${this.lives}`);
        
        // 只重置速度和清空堆叠，保持位置不变
        this.velocity = 0;
        this.dir = 0;
        this.stack = [];
    }

    move() {
        this.updateAcceleration(); 
        this.updateVelocity(); 
        
        // 计算新位置
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, width - this.w);
        
        // 计算移动距离
        let dx = newX - this.x;
        
        // 同时更新玩家和草块的位置
        this.x = newX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }
    
    updateAcceleration() {
        // 根据堆叠数量计算实际加速度
        let stackFactor = Math.max(0.4, 1 - (this.stack.length * 0.12));
        let currentAcceleration = this.baseAcceleration * stackFactor;
        
        if (this.dir !== 0) {
            this.acceleration = this.dir * currentAcceleration;
        } else {
            this.acceleration = 0;
        }
    }

    updateVelocity() {
        // 根据堆叠数量计算实际最大速度
        let stackFactor = Math.max(0.3, 1 - (this.stack.length * 0.15));
        let currentMaxSpeed = this.baseMaxSpeed * stackFactor;
        
        // 应用加速度
        this.velocity += this.acceleration;
        
        // 应用摩擦力
        if (this.dir === 0) {
            this.velocity *= this.friction;
        }
        
        // 如果速度非常小，直接设为0
        if (Math.abs(this.velocity) < 0.1) {
            this.velocity = 0;
        }
        
        // 限制速度范围
        this.velocity = constrain(this.velocity, -currentMaxSpeed, currentMaxSpeed);
    }

    moveAsWhole() {
        // 计算新位置
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, width - this.w);
        
        // 计算移动距离
        let dx = newX - this.x;
        
        // 同时更新玩家和草块的位置
        this.x = newX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    // 移除不需要的方法
    updatePosition() {
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, width - this.w);
        return newX - this.x;
    }

    updateStack() {
        // 不再需要单独的更新逻辑
    }

    checkGrassCollision(grass) {
        let minOverlap = grass.size.x * 0.3; // 保持30%的重叠要求
        
        if (this.stack.length === 0) {
            // 如果没有草，使用玩家矩形的位置判断
            let catchXStart = this.x;
            let catchXEnd = this.x + this.w;
            
            // 计算与玩家的重叠
            let overlapStart = Math.max(catchXStart, grass.x);
            let overlapEnd = Math.min(catchXEnd, grass.x + grass.size.x);
            let overlapWidth = overlapEnd - overlapStart;

            if (overlapWidth < minOverlap) return false;

            return (
                grass.y + grass.size.y >= this.y &&      // 草块底部要接触到玩家顶部
                grass.y + grass.size.y <= this.y + 10    // 草块底部不能太低
            );
        } else {
            // 如果有草，使用最上面的草块的位置判断
            let topGrass = this.stack[this.stack.length - 1];
            let catchXStart = topGrass.x;
            let catchXEnd = topGrass.x + topGrass.size.x;
            
            // 计算与顶部草块的重叠
            let overlapStart = Math.max(catchXStart, grass.x);
            let overlapEnd = Math.min(catchXEnd, grass.x + grass.size.x);
            let overlapWidth = overlapEnd - overlapStart;

            if (overlapWidth < minOverlap) return false;

            return (
                grass.y + grass.size.y >= topGrass.y &&      // 草块底部要接触到顶部草块
                grass.y + grass.size.y <= topGrass.y + 10    // 草块底部不能太低
            );
        }
    }

    catchGrass(grass) {
        if (this.checkGrassCollision(grass)) {
            if (this.stack.length >= this.maxStack) {
                this.loseLife();
            } else {
                // 直接将草块添加到堆叠中，保持其当前位置
                this.stack.push(grass);
            }
            return true;
        }
        return false;
    }

    dropGrass() {
        if (!this.basket) return;
        if (this.stack.length === 0) return;
    
        if (this.x + this.w >= this.basket.position.x && this.x <= this.basket.position.x + this.basket.size.x) {
            let collectedGrass = this.stack.length;
    
            this.basket.updateStats(collectedGrass); // 更新篮子统计信息
            this.stack = [];
    
            this.baseMaxSpeed = 15; // 恢复原始最大速度
            this.baseAcceleration = 1.8;
        }
    }
    
    drawPlayer() {
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
    
        // 绘制堆叠的草，保持其原始位置
        for (let grass of this.stack) {
            grass.show();
        }
    }
    
}





