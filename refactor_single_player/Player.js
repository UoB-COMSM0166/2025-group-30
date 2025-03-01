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
        this.basket = null;

        this.x = width / 2;
        this.y = height - 50;
        this.velocity = 0;
        this.acceleration = 0;
    }
    
    resetPosition() {
        this.x = width / 2;
        this.velocity = 0;
        this.dir = 0;
        this.stack = []; // 清空堆叠的草块
    }

    handleInput(key) {
        if (key === 'ArrowLeft') {
            this.dir = -1;
        } else if (key === 'ArrowRight') {
            this.dir = 1;
        }
    }

    stopInput(key) {
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            this.dir = 0;
        }
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
        //先检查是否能接住这个草
        if (this.checkGrassCollision(grass)) {
            //再检查是否超过最大接草数
            if (this.stack.length >= this.maxStack) {
                this.loseLife();
                this.stack = [];
            } else {
                let topGrass = this.stack.length === 0 ? { x: this.x, y: this.y } : this.stack[this.stack.length - 1];
                grass.y = topGrass.y - grass.size.y; // 让新草块叠加在最上方的草块上
                grass.x = grass.x; // 保持原始 x 位置
                this.stack.push(grass);
            }
            return true;
        }
        return false;
    }

    dropGrass() {
        if (!this.basket) return;
        if (this.stack.length === 0) return;
    
        if (this.x + this.w >= this.basket.x && this.x <= this.basket.x + this.basket.w) {
            let collectedGrass = this.stack.length;
    
            for (let grass of this.stack) {
                grass.enterBasket();
            }
    
            score += collectedGrass;
            this.stack = [];
    
            this.maxSpeed = 10;
            this.accelerationValue = 2;
        }
    }
    
    drawPlayer() {
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);

        let previousY = this.y;
        for (let i = 0; i < this.stack.length; i++) {
            //stack渲染
            let grass = this.stack[i];
            grass.y = previousY - grass.size.y;
            previousY = grass.y;
            grass.show();
        }
    }
}





