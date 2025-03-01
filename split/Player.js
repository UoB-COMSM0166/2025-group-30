class Player {
    constructor(x, y, isLeft) {
        this.gameManager = gameManager;

        this.isLeft = isLeft; //used only for pvp mode
        
        this.w = 100;
        this.h = 20;
        this.x = x;
        this.y = height - 50;

        this.velocity = 0;
        this.maxSpeed = 10;
        this.minSpeed = 5;
        this.acceleration = 2;

        this.stack = [];  //visible caught grass
        this.maxStack = 5; 
        
        this.basket = null; // 确保basket被正确初始化

        this.paused = false;
    }

    resetPosition(isLeft) {
        if (this.gameManager.state.isPlayAgainstMode) {
            this.x = isLeft ? 60 : width - 160;
        } else {
            this.x = isLeft ? width / 4 - this.w / 2 : (3 * width) / 4 - this.w / 2;
        }
        this.y = height - 50; 
        this.velocity = 0;
    }

    catchGrass(grass) {
        // 如果已经接住5个方块，则不能再接
        if (this.stack.length > this.maxStack) {
            if(this.gameManager.state.isPlayAgainstMode){
                if(this.isLeft) this.gameManager.state.lives1--;
                else this.gameManager.state.lives2--;
            } else {

//#### potential bug? (both players lose a life if one of them has more than 5 grass) ####

                this.gameManager.state.lives1--;
                this.gameManager.state.lives2--; 
            }
            this.stack = [];
            this.maxSpeed = 10;
            this.paused = true;
            if(this.isLeft) this.gameManager.flashTimer1 = 90;
            else this.gameManager.flashTimer2 = 90;
            if((this.isLeft && this.gameManager.lives1 <=0) || (!this.isLeft && this.gameManager.lives2 <=0)){
                this.gameManager.gameOver = true;
            }
            return false;
        }
        // 如果是第一个方块，检查是否与木板接触
        if (this.stack.length === 0) {
            if (grass.y + grass.size1 >= this.y && 
                grass.y + grass.size1 <= this.y + this.h &&
                grass.x + grass.size2/2 >= this.x && 
                grass.x + grass.size2/2 <= this.x + this.w) {
                
                grass.y = this.y - grass.size1;
                this.stack.push(grass);
                return true;
            }
        } else {
            // 获取最上面的方块
            const topGrass = this.stack[this.stack.length - 1];
            
            // 检查是否与最上面的方块接触
            const newLeft = Math.round(grass.x);
            const newRight = Math.round(grass.x + grass.size2);
            const topLeft = Math.round(topGrass.x);
            const topRight = Math.round(topGrass.x + topGrass.size2);

            const hasHorizontalOverlap = !(newRight <= topLeft || newLeft >= topRight);
            const isVerticalContact = (grass.y + grass.size1) >= topGrass.y - 5;
            
            if (hasHorizontalOverlap && isVerticalContact) {
                grass.y = this.y - (this.stack.length + 1) * grass.size1;
                this.stack.push(grass);
                return true;
            }
        }
        
        return false;
    }


    dropGrass() {
        if (this.stack.length === 0) return; // 如果没有草，直接返回
        //console.log("Current game mode - isPlayAgainstMode:", this.gameManager.state.isPlayAgainstMode); // 访问 GameManager 的状态
        //console.log("Player 2 assigned basket:", this.basket);
        //console.log("Player 2 assigned basket x:", this.basket.x);
        //console.log("DropGrass - Player 2 basket x:", this.basket.x);
        //console.log("DropGrass - Player 2 isLeft:", this.basket.isLeft);
//console.log("DropGrass - Player 2 position x:", this.x);
//console.log("Condition check: ", (this.x + this.w >= this.basket.x), "&&", (this.x <= this.basket.x + this.basket.w));

    
        // 检查是否在篮子范围内
        if (this.gameManager.state.isPlayAgainstMode) {
            if (this.isLeft && this.x > width / 2) {
                //console.log("Player not in correct half");
                return;
            }
            if (!this.isLeft && this.x < width / 2) {
                //console.log("Player not in correct half");
                return;
            }
        }
    
        // 计算分数并清空草堆
        const basket = this.basket;
        //console.log(`Player ${this.isLeft ? "1" : "2"} basket:`, basket); 
        //console.log(`Basket range: x=${basket.x}, w=${basket.w}`);
        //console.log(`Player ${this.isLeft ? "1" : "2"} position: x=${this.x}, w=${this.w}`);

        if (this.x + this.w >= basket.x && this.x <= basket.x + basket.w) {
            const score = this.stack.length;
            if (this.isLeft) {
                this.gameManager.state.score1 += score;
            } else {
                this.gameManager.state.score2 += score;
            }
            this.stack = []; // 清空草堆
            //console.log("Grass dropped successfully!");
        } else {
            //console.log("Not in basket range");
        }
    }

    show() {
        // 如果闪烁计时器正在运行且 isFlashVisible 为 false，则不显示玩家
        if ((this.isLeft && gameManager.flashTimer1 > 0 && !gameManager.state.isFlashVisible) || 
            (!this.isLeft && gameManager.flashTimer2 > 0 && !gameManager.state.isFlashVisible)) {
            return;
        }

        // 显示蓝色木板
        noStroke();
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);

        // 显示堆叠的草
        for (let grass of this.stack) {
            fill(0, 255, 0);
            rect(grass.x, grass.y, grass.size2, grass.size1);
        }

        // 显示碰撞检测范围（调试用）
        if (this.basket) {
            noFill();
            rect(this.basket.x, this.basket.y, this.basket.w, this.basket.h);
            line(this.x + this.w / 2, this.y, this.x + this.w / 2, this.y + this.h);
        }
    }

    update() {
        if (this.paused) return;

        const oldX = this.x;
        
        // 更新位置
        if (this.isLeft) {
            this.velocity = gameManager.moveDirection1 * this.maxSpeed;
        } else {
            this.velocity = gameManager.moveDirection2 * this.maxSpeed;
        }
        
        this.x += this.velocity;

        // 限制移动范围
        if (gameManager.state.isPlayAgainstMode) {
            if (this.isLeft) {
                this.x = constrain(this.x, 0, width/2 - this.w);
            } else {
                this.x = constrain(this.x, width/2, width - this.w);
            }
        } else {
            this.x = constrain(this.x, 0, width - this.w);
        }

        // 计算x轴移动距离并更新堆叠的草的位置
        const dx = this.x - oldX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }
}
