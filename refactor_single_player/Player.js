class Player {
    constructor() {
        this.w = 120; 
        this.h = 20;
        this.stack = []; // Stack for caught grass
        this.maxStack = 5; // Maximum grass stack size
        this.maxSpeed = 15;
        this.accelerationValue = 2;
        this.minSpeed = 5;
        this.lives = 3;
        this.dir = 0;
        this.basket = new Basket(); // 初始化篮子

        this.x = width / 2;
        this.baseY = height - 50; // 记录初始 Y 位置
        this.y = this.baseY;
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
        if (this.lives <= 0) {
            console.log("Game Over!");
            // 这里可以添加游戏结束的逻辑
        }
        this.resetPosition(); // 生命减少后重置玩家状态
    }

    move() {
        this.updateAcceleration(); 
        this.updateVelocity(); 
        this.updatePosition(); 
        this.updateStack(); 
    }
    
    updateAcceleration() {
        if (this.dir !== 0) {
            this.acceleration = this.dir * this.accelerationValue;
        } else {
            this.acceleration = 0;
        }
    }

    updateVelocity() {
        let speedReduction = this.stack.length * 1.5; // 每个堆叠的草块减少速度
        let adjustedMaxSpeed = Math.max(15 - speedReduction, this.minSpeed);
        
        this.velocity += this.acceleration;
        this.velocity = constrain(this.velocity, -adjustedMaxSpeed, adjustedMaxSpeed);
    }

    //玩家只能左右移动，位置只更新x轴，y轴受stack的影响
    updatePosition() {
        let newX = this.x + this.velocity;
        newX = constrain(newX, 0, width - this.w);
        let dx = newX - this.x;
        this.x = newX;
        return dx;
    }

    updateStack() {
        let dx = this.updatePosition();
        for (let i = 0; i < this.stack.length; i++) {
            let grass = this.stack[i];
            grass.x += dx;
        }
        // 更新玩家 Y 位置，使其随着 stack 增长而上升
        this.y = this.baseY - this.stack.length * 20;
    }

    checkGrassCollision(grass) {
        let topGrass = this.stack.length === 0 ? null : this.stack[this.stack.length - 1];
        let catchXStart = this.x - 10;
        let catchXEnd = this.x + this.w + 10;
        let tolerance = 5;

        return (
            grass.y + grass.size.y >= (topGrass ? topGrass.y - grass.size.y : this.y - grass.size.y) - tolerance &&
            grass.x + grass.size.x > catchXStart &&
            grass.x < catchXEnd
        );
    }

    catchGrass(grass) {
        if (this.checkGrassCollision(grass)) {
            if (this.stack.length >= this.maxStack) {
                this.loseLife();
                this.stack = [];
                this.y = this.baseY; // 清空stack 玩家复位 Y 位置
            } else {
                let topGrass = this.stack.length === 0 ? { x: this.x, y: this.y } : this.stack[this.stack.length - 1];
                grass.y = topGrass.y - grass.size.y;
                grass.x = topGrass.x;
                this.stack.push(grass);
                this.y = this.baseY - this.stack.length * 20;
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
            this.y = this.baseY; // 复位 Y 位置
    
            this.maxSpeed = 15; // 恢复原始最大速度
            this.accelerationValue = 2;
        }
    }
    
    drawPlayer() {
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
    
        let previousY = this.y;///
        let previousX = this.x; // 记录当前 玩家x 位置
    
        for (let i = 0; i < this.stack.length; i++) {
            let grass = this.stack[i];
    
            // 确保草块跟随玩家移动
            grass.x = previousX;
            grass.y = previousY - grass.size.y;
    
            previousY = grass.y; // 更新 y 位置
            previousX = grass.x; // 更新 x 位置
            grass.show();
        }
    }
    
}





