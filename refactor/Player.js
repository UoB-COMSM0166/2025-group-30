class Player {
    constructor(position = "middle") {   
        this.position = position; //used only for pvp mode
        
        this.w = 100;
        this.h = 20;

        if (position === "middle") this.x = (width - this.w)/2;
        else if (position === "left" || position === "pvpLeft") this.x = (width - this.w)/4;
        else if (position === "right" || position === "pvpRight") this.x = (width - this.w)/4*3;
        
        this.y = height - 50; //stay the same
        this.score = 0;

        this.velocity = 0;
        this.maxSpeed = 10;
        this.minSpeed = 5;
        this.acceleration = 2;
        this.decelerationFactor = 0.8;
        this.dir = 0;

        this.stack = [];  //visible caught grass
        this.maxStack = 5; 
        
        this.basket = null; // 确保basket被正确初始化

        this.flash = new Flash(0); 
    }

    reset() {   
        if (this.position === "middle") (width - this.w)/2;
        else if (this.position === "left") this.x = (width - this.w)/4;
        else if (this.position === "right") this.x = (width - this.w)/4*3;
        
        this.score = 0;

        this.velocity = 0;
        this.dir = 0;

        this.stack = []; 
        this.flash.flashDuration = 0;
    }

    move() {
        //if (this.flash.flashDuration>0 && !this.flash.showPlayer) return;
        if (this.flash.flashDuration > 0) return;

        const oldX = this.x;

        if (this.dir !== 0) {
            if (Math.sign(this.dir) !== Math.sign(this.velocity) && abs(this.velocity) > 0.1) {
                this.velocity = this.dir * (this.acceleration + abs(this.velocity) * 0.5);
            } else {
                this.velocity += this.dir * this.acceleration;
                this.velocity = constrain(this.velocity, -this.maxSpeed, this.maxSpeed);
            }
        } else {
            this.velocity *= this.decelerationFactor;
            if (abs(this.velocity) < 0.1) this.velocity = 0;
        }

        // 限制移动范围
        if (this.position === "pvpLeft") this.x = constrain(this.x, 0, width/2 - this.w);
        else if (this.position === "pvpRight") this.x = constrain(this.x, width/2, width - this.w);
        else this.x = constrain(this.x, 0, width - this.w);

        // 计算x轴移动距离并更新堆叠的草的位置 caught grass moves with the player
        this.x += this.velocity;
        const dx = this.x - oldX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    show() { //draw player with caught grass    
        this.flash.update();
        if (!this.flash.showPlayer) return;//player with grass is not shown if flash is running 

        // 显示蓝色木板
        noStroke();
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);
    
        //draw caught grass
        for (let grass of this.stack) {
            fill(0, 255, 0);
            rect(grass.x, grass.y, grass.w, grass.h);
        }
        
    }
    
    catchGrass(grass) { //return true if grass is caught, false otherwise
        if (this.stack.length > this.maxStack) { //can't have more than 5 grass on the platform
            this.stack = [];
            this.flash.flashDuration = 30; // trigger flash
            return false;
        }

        // 如果是第一个方块，检查是否与木板接触
        if (this.stack.length === 0) {
            if (grass.y + grass.h >= this.y && 
                grass.y + grass.h <= this.y + this.h &&
                grass.x + grass.w/2 >= this.x && 
                grass.x + grass.w/2 <= this.x + this.w) {
                
                grass.y = this.y - grass.h;
                this.stack.push(grass);
                return true;
            }
        } else {
            // 获取最上面的方块
            const topGrass = this.stack[this.stack.length - 1];
            
            // 检查是否与最上面的方块接触
            const newLeft = Math.round(grass.x);
            const newRight = Math.round(grass.x + grass.w);
            const topLeft = Math.round(topGrass.x);
            const topRight = Math.round(topGrass.x + topGrass.w);

            const hasHorizontalOverlap = !(newRight <= topLeft || newLeft >= topRight);
            const isVerticalContact = (grass.y + grass.h) >= topGrass.y - 5;
            
            if (hasHorizontalOverlap && isVerticalContact) {
                grass.y = this.y - (this.stack.length + 1) * grass.h;
                this.stack.push(grass);
                return true;
            }
        }       
        return false;
    }

    emptyGrass() { //empty grass to the basket
        if (this.stack.length === 0) return;
        if (this.x <= this.basket.x + this.basket.w) {
            this.score += this.stack.length;
            this.stack = [];
        }
    }
}


