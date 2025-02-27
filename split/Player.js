class Player {
    constructor(isLeft, gameManager) {
        this.x = isLeft ? width * 0.25 : width * 0.75;
        this.y = height - 50;
        this.w = 60;
        this.h = 10;
        this.isLeft = isLeft;
        this.stack = [];
        this.gameManager = gameManager;
        this.basket = isLeft ? gameManager.basket1 : gameManager.basket2;
        this.ability = new PlayerAbility(this);
    }

    update(moveDirection) {
        this.ability.move(moveDirection);
    }

    draw() {
        // 绘制木板
        fill(0, 0, 255);
        rect(this.x, this.y, this.w, this.h);

        // 绘制堆叠的草
        for (const grass of this.stack) {
            grass.draw();
        }
    }

    reset() {
        this.x = this.isLeft ? width * 0.25 : width * 0.75;
        this.stack = [];
    }
} 