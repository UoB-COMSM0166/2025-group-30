class Player {
    constructor(position = "middle") {   
        this.position = position; //used only for pvp mode
        
        this.w = 100;
        this.h = 20;

        if (position === "middle") this.x = (baseWidth- this.w)/2;
        else if (position === "left" || position === "pvpLeft") this.x = (baseWidth- this.w)/4;
        else if (position === "right" || position === "pvpRight") this.x = (baseWidth- this.w)/4*3;
        
        this.y = baseHeight- 50; //stay the same
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
        if (this.position === "middle") (baseWidth- this.w)/2;
        else if (this.position === "left") this.x = (baseWidth- this.w)/4;
        else if (this.position === "right") this.x = (baseWidth- this.w)/4*3;
        
        this.score = 0;

        this.velocity = 0;
        this.dir = 0;

        this.stack = []; 
        this.flash.flashDuration = 0;
    }

    movePlayerWithCaughtGrass() {
        if (this.flash.flashDuration > 0) {return;}

        const oldX = this.x;

        if (this.dir !== 0) {
            if (Math.sign(this.dir) !== Math.sign(this.velocity)  //player changes direction
                && abs(this.velocity) > 0.1) {
                this.velocity = this.dir * (this.acceleration + abs(this.velocity) * 0.5);
            } else { //continue moving in the same direction
                this.velocity += this.dir * this.acceleration;
                this.velocity = constrain(this.velocity, -this.maxSpeed, this.maxSpeed);
            }
        } else {
            this.velocity *= this.decelerationFactor;
            if (abs(this.velocity) < 0.1) this.velocity = 0;
        }

        // 限制移动范围
        if (this.position === "pvpLeft") this.x = constrain(this.x, 0, width/2 - this.w);
        else if (this.position === "pvpRight") this.x = constrain(this.x, width/2, baseWidth- this.w);
        else this.x = constrain(this.x, 0, baseWidth- this.w);

        // 计算x轴移动距离并更新堆叠的草的位置 caught grass moves with the player
        this.x += this.velocity;
        const dx = this.x - oldX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    drawPlayerWithCaughtGrass() { //draw player with caught grass    
        this.flash.update();
        if (!this.flash.playerIsVisible) return;//player with grass is not shown if flash is running 

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

    // erasePlayerWithCaughtGrass() {
    //     for (let grass of this.stack) {
    //         fill()
    //     }
    // }
    
    checkGrassCaught(grass) { //return true if grass is caught, false otherwise
        // 如果是第一个方块，检查是否与木板接触
        if (this.stack.length === 0) {
            // Calculate overlap with player platform
            const overlapLeft = Math.max(this.x, grass.x);
            const overlapRight = Math.min(this.x + this.w, grass.x + grass.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * grass.w; // 20% of grass width
            
            if (grass.y + grass.h >= this.y && 
                grass.y + grass.h <= this.y + 2 && // if the falling grass is 2 pixel below the player platform, it cannot be caught
                overlapWidth >= minRequiredOverlap) {
                
                grass.y = this.y - grass.h;
                this.stack.push(grass);
                
                // Check if adding this grass exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                }
                return true;
            }
        } else {
            // 获取最上面的方块
            const topGrass = this.stack[this.stack.length - 1];
            
            // Calculate overlap with top grass in stack
            const overlapLeft = Math.max(topGrass.x, grass.x);
            const overlapRight = Math.min(topGrass.x + topGrass.w, grass.x + grass.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * grass.w; // 20% of grass width
            
            // if the falling grass is 2 pixel below the player platform, it cannot be caught
            const isVerticalContact = ((grass.y + grass.h) >= topGrass.y) && ((grass.y + grass.h) <= topGrass.y + 2);
            
            if (overlapWidth >= minRequiredOverlap && isVerticalContact) {
                grass.y = this.y - (this.stack.length + 1) * grass.h;
                this.stack.push(grass);
                
                // Check if adding this grass exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                }
                return true;
            }
        }       
        return false;       
    }


    emptyToBasket() { //empty grass to the basket
        if (this.stack.length === 0) return;
        if (this.x <= this.basket.x + this.basket.w) {
            this.score += this.stack.length;
            this.stack = [];
        }
    }
}
