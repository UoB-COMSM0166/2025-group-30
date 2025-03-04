class Player {
    constructor(id = 0, color = 'blue', position = 'center') {
        this.id = id; // 0 for single player, 1 for player 1, 2 for player 2
        this.color = color;
        this.position = position; // 'center', 'left', 'right'
        
        this.w = 120; 
        this.h = 20;
        this.stack = []; // Stack for caught grass
        this.maxStack = 5; // Maximum grass stack size
        this.baseMaxSpeed = 15; // Base maximum speed
        this.baseAcceleration = 1.8; // Base acceleration
        this.friction = 0.8; // Friction coefficient
        this.minSpeed = 3;
        this.dir = 0;
        this.basket = new Basket(); // Initialize basket

        // Use fixed base dimensions
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // Set initial position based on player position parameter
        if (this.position === 'center') {
            this.x = this.baseWidth / 2 - this.w / 2;
        } else if (this.position === 'left') {
            this.x = this.baseWidth / 4 - this.w / 2;
        } else if (this.position === 'right') {
            this.x = this.baseWidth * 3 / 4 - this.w / 2;
        }
        
        this.baseY = this.baseHeight - 50; // Record initial Y position
        this.y = this.baseY; // Player will always stay at this height
        this.velocity = 0;
        this.acceleration = 0;
        
        // Add properties for blinking and pausing
        this.isBlinking = false;     // Whether in blinking state
        this.blinkStartTime = 0;     // Blink start time
        this.blinkDuration = 500;    // Blink duration (milliseconds)
        this.blinkInterval = 100;    // Blink interval (milliseconds)
        this.visible = true;         // Controls character visibility when blinking
        this.isPaused = false;       // Whether paused
    }
    
    resetPosition() {
        // Reset position based on player position parameter
        if (this.position === 'center') {
            this.x = this.baseWidth / 2 - this.w / 2;
        } else if (this.position === 'left') {
            this.x = this.baseWidth / 4 - this.w / 2;
        } else if (this.position === 'right') {
            this.x = this.baseWidth * 3 / 4 - this.w / 2;
        }
        
        this.velocity = 0;
        this.dir = 0;
        this.stack = []; // Clear stacked hay blocks
        this.y = this.baseY; // Reset Y position
        this.isBlinking = false;
        this.isPaused = false;
        this.visible = true;
        
        // console.log(`Player ${this.id} position reset:`, this.x, this.y);
    }

    loseLife(clearStack = false) {
        // 开始闪烁和暂停效果
        this.startBlinking();
        
        this.velocity = 0;
        this.dir = 0;
        if (clearStack) {
            this.stack = [];
        }
    }
    
    // 修改开始闪烁方法，支持PvP模式下的更长闪烁时间
    startBlinking() {
        this.isBlinking = true;
        this.isPaused = true;
        this.blinkStartTime = millis();
        this.visible = false;
    }
    
    // 修改更新闪烁状态方法，使用统一的闪烁持续时间
    updateBlinkState() {
        if (!this.isBlinking) return;
        
        let currentTime = millis();
        let elapsedTime = currentTime - this.blinkStartTime;
        
        // 统一使用blinkDuration，不再区分模式
        // let duration = this.isPvpMode ? this.pvpBlinkDuration : this.blinkDuration;
        
        // 如果闪烁时间已结束
        if (elapsedTime >= this.blinkDuration) {
            this.isBlinking = false;
            this.isPaused = false;
            this.visible = true;
            return;
        }
        
        // 控制闪烁效果
        this.visible = (Math.floor(elapsedTime / this.blinkInterval) % 2) === 0;
    }

    move() {
        // If player is paused, don't move
        if (this.isPaused) {
            this.updateBlinkState();
            return;
        }
        
        // Update acceleration and velocity
        this.updateAcceleration(); 
        this.updateVelocity(); 
        
        // Calculate new position
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, this.baseWidth - this.w);
        
        // Calculate movement distance
        let dx = newX - this.x;
        
        // Update player and hay block positions
        this.x = newX;
        this.updateStack(dx);
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

    updateStack(dx) {
        // 更新所有堆叠草块的位置
        for (let grass of this.stack) {
            grass.x += dx;
        }
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
        if (!this.basket) {
            return;
        }
        if (this.stack.length === 0) {
            return;
        }

        if (this.x + this.w >= this.basket.position.x && this.x <= this.basket.position.x + this.basket.size.x) {
            let collectedGrass = this.stack.length;
            
            // 直接使用basket的updateScore方法
            this.basket.updateScore(collectedGrass);
            
            this.stack = [];
            this.baseMaxSpeed = 15; // 恢复原始最大速度
            this.baseAcceleration = 1.8;
        }
    }
    
    drawPlayer() {
        // Update blink state
        this.updateBlinkState();
        
        // If visible, draw the player
        if (this.visible) {
            fill(this.color);
            rect(this.x, this.y, this.w, this.h);
        
            // Draw stacked hay, keeping their original positions
            for (let grass of this.stack) {
                grass.show();
            }
            
        } else {
            for (let grass of this.stack) {
                grass.show();
            }
        }
    }
    
}





