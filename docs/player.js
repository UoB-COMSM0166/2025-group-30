class Player {
    constructor(isLeft, basket) {
        this.isLeft = isLeft;
        this.basket = basket; // 传递篮子引用
        this.resetPosition(isLeft); // 初始化位置
        this.w = 120;
        this.h = 20;
        this.stack = [];
        this.maxSpeed = 10;
        this.acceleration = 2;
        this.decelerationFactor = 0.8;
        this.velocity = 0; // 初始速度为 0
        this.minSpeed = 2;
        this.paused = false; // 每个玩家独立的暂停状态
    }

    resetPosition(isLeft) {
        this.x = isLeft ? width / 4 - this.w / 2 : (3 * width) / 4 - this.w / 2;
        this.y = height - 50;
    }

    move(dir) {
        if (dir !== 0) {
            if (Math.sign(dir) !== Math.sign(this.velocity) && abs(this.velocity) > 0.1) {
                this.velocity = dir * (this.acceleration + abs(this.velocity) * 0.5);
            } else {
                this.velocity += dir * this.acceleration;
                this.velocity = constrain(this.velocity, -this.maxSpeed, this.maxSpeed);
            }
        } else {
            this.velocity *= this.decelerationFactor;
            if (abs(this.velocity) < 0.1) this.velocity = 0;
        }

        let newX = this.x + this.velocity;
        if (isPlayAgainstMode) {
            if (this.isLeft) {
                newX = constrain(newX, 0, width / 2 - this.w);
            } else {
                newX = constrain(newX, width / 2, width - this.w);
            }
        } else {
            newX = constrain(newX, 0, width - this.w);
        }
        let dx = newX - this.x;
        this.x = newX;

        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    catchGrass(grass) {
        if (this.stack.length > 5) {
            if (this.isLeft) lives1--;
            else lives2--;
            this.stack = [];
            this.maxSpeed = 10;
            paused = true;
            if (this.isLeft) flashTimer1 = 90;
            else flashTimer2 = 90;
            if ((this.isLeft && lives1 <= 0) || (!this.isLeft && lives2 <= 0)) {
                gameOver = true;
            }
            return false;
        }

        let topGrass = this.stack.length === 0 ? null : this.stack[this.stack.length - 1];
        let topY = topGrass ? topGrass.y - grass.size1 : this.y - grass.size1;
        let catchXStart = topGrass ? topGrass.x : this.x;
        let catchXEnd = topGrass ? topGrass.x + topGrass.size2 : this.x + this.w;

        if (
            grass.y + grass.size1 >= topY &&
            grass.y + grass.speed >= topY &&
            grass.y < topY + grass.speed &&
            grass.x + grass.size2 > catchXStart &&
            grass.x < catchXEnd
        ) {
            let relativeX = grass.x - catchXStart;
            grass.y = topY;
            grass.x = catchXStart + relativeX;
            this.stack.push(grass);
            this.maxSpeed = max(this.minSpeed, this.maxSpeed - 1);
            this.acceleration = max(0.5, this.acceleration - 0.2);
            return true;
        }
        return false;
    }

dropGrass() {
        let targetBasket = this.basket; 
        if (!isPlayAgainstMode && !this.isLeft) {
            targetBasket = basket1;
        }

        if (this.x <= targetBasket.x + targetBasket.w && this.x >= targetBasket.x - this.w) {
            if (this.isLeft) {
                score1 += this.stack.length;
            } else {
                score2 += this.stack.length;
            }
            this.stack = [];
            this.maxSpeed = 10;
            this.acceleration = 2;
        }
    }

    update() {}

    show() {
        if ((this.isLeft && flashTimer1 > 0 && !isFlashVisible) || (!this.isLeft && flashTimer2 > 0 && !isFlashVisible)) {
            return;
        }
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
        for (let i = 0; i < this.stack.length; i++) {
            fill(0, 255, 0);
            rect(this.stack[i].x, this.stack[i].y, this.stack[i].size2, this.stack[i].size1);
        }
    }
}