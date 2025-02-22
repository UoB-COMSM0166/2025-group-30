
class Player {
    constructor() {
        this.resetPosition();
        this.w = 120;
        this.h = 20;
        this.stack = [];
        this.maxSpeed = 15;
        this.acceleration = 2;
        this.decelerationFactor = 0.8;
        this.velocity = 0;
        this.minSpeed = 2;
    }

    resetPosition() {
        this.x = width / 2;
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
        newX = constrain(newX, 0, width - this.w);
        let dx = newX - this.x;
        this.x = newX;
        
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }



    catchGrass(grass) {
        if (this.stack.length > 5) {
            lives--;
            this.stack = [];
            this.maxSpeed = 10;
            paused = true;
            flashTimer = 90;
            if (lives <= 0) {
                gameOver = true;
            }
            return false;
        }
        
        let topGrass = this.stack.length === 0 ? null : this.stack[this.stack.length - 1];
        let topY = topGrass ? topGrass.y - grass.height : this.y - grass.height;
        let catchXStart = topGrass ? topGrass.x : this.x; //left of the catching platform
        let catchXEnd = topGrass ? topGrass.x + topGrass.width : this.x + this.w;
        
        if (
            grass.y + grass.height >= topY && // grass bottom below topY
            grass.y + grass.speed >= topY && // next frame grass top below topY
            //grass.y < topY + grass.speed &&
            grass.y <= topY && //top of grass above topY
            grass.x + grass.width * 0.7 >= catchXStart && //at least 30% the grass need to be on the platform
            grass.x + grass.width * 0.3 <= catchXEnd // at least 30% of the grass need to be on the platform 
        ) {
            //let relativeX = grass.x - catchXStart;
            grass.y = topY;
            //grass.x = catchXStart + relativeX;
            this.stack.push(grass);
            //this.maxSpeed = max(this.minSpeed, this.maxSpeed - 1); 
            this.acceleration = max(0.5, this.acceleration - 0.2);
            return true;
        }
        return false;
    }
    
    dropGrass() {
        if (this.x <= basket.x + basket.w) {
            score += this.stack.length;
            this.stack = [];
            this.maxSpeed = 10;
            this.acceleration = 2;
        }
    }
    
    update() {}
    
    show() {
        if (flashTimer > 0 && !isFlashVisible) {
            return;
        }
    
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
    
        for (let i = 0; i < this.stack.length; i++) {
            fill(0, 255, 0);
            rect(this.stack[i].x, this.stack[i].y, this.stack[i].width, this.stack[i].height);
        }
    }
}


