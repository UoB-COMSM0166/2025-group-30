class PlayerAbility {
    constructor(player) {
        this.player = player;
        this.moveSpeed = 5;
    }

    move(direction) {
        // 更新位置
        this.player.x += direction * this.moveSpeed;
        
        // 限制在画布范围内
        this.player.x = constrain(this.player.x, 0, width - this.player.w);

        // 更新堆叠的草的位置
        for (let i = 0; i < this.player.stack.length; i++) {
            this.player.stack[i].x = this.player.x;
            this.player.stack[i].y = this.player.y - (i + 1) * this.player.stack[i].size1;
        }
    }

    dropGrass() {
        if (this.player.stack.length === 0) return;

        // 在对抗模式下检查半场限制
        if (this.player.gameManager.state.isPlayAgainstMode) {
            if (this.player.isLeft && this.player.x > width / 2) {
                console.log("Player not in correct half");
                return;
            }
            if (!this.player.isLeft && this.player.x < width / 2) {
                console.log("Player not in correct half");
                return;
            }
        }

        // 在合作模式下，两个玩家都使用左边的篮子
        if (!this.player.gameManager.state.isPlayAgainstMode) {
            const basket = this.player.gameManager.basket1;
            const grass = this.player.stack[this.player.stack.length - 1];
            if (grass.x + grass.size2 >= basket.x && 
                grass.x <= basket.x + basket.w &&
                grass.y + grass.size1 >= basket.y) {
                const score = this.player.stack.length;
                if (this.player.isLeft) {
                    this.player.gameManager.state.score1 += score;
                } else {
                    this.player.gameManager.state.score2 += score;
                }
                this.player.stack = [];
            }
        } else {
            // 对抗模式下使用各自的篮子
            const basket = this.player.basket;
            const grass = this.player.stack[this.player.stack.length - 1];
            if (grass.x + grass.size2 >= basket.x && 
                grass.x <= basket.x + basket.w &&
                grass.y + grass.size1 >= basket.y) {
                const score = this.player.stack.length;
                if (this.player.isLeft) {
                    this.player.gameManager.state.score1 += score;
                } else {
                    this.player.gameManager.state.score2 += score;
                }
                this.player.stack = [];
            }
        }
    }

    catchGrass(grass) {
        this.player.stack.push(grass);
    }
} 