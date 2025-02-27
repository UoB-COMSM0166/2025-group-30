 // 在 handleKeyPressed 方法中
if (keyCode === 32) { // 空格键
    this.player1.ability.dropGrass();
}
// ...
if (keyCode === ENTER) {
    this.player2.ability.dropGrass();
}

// 在 CollisionHandler 中
checkPlayerCollision(grass, player); {
    if (grass.x + grass.size2 >= player.x &&
        grass.x <= player.x + player.w &&
        grass.y + grass.size1 >= player.y &&
        grass.y <= player.y + player.h) {
        const index = player.gameManager.grasses.indexOf(grass);
        if (index > -1) {
            player.gameManager.grasses.splice(index, 1);
            player.ability.catchGrass(grass);
        }
    }
}

class GameManager {
    constructor() {
        this.state = new State();
        this.score = new Score();
        this.lives = new Lives();
        this.collisionHandler = new CollisionHandler();
        
        // 初始化篮子
        this.basket1 = new Basket(true);
        this.basket2 = new Basket(false);
        
        // 初始化玩家
        this.player1 = new Player(true, this);
        this.player2 = new Player(false, this);
        
        this.grasses = [];
        this.lastGrassTime = 0;
        this.grassInterval = 1000;
        
        // 移动方向
        this.moveDirection1 = 0;
        this.moveDirection2 = 0;
        
        // 游戏模式
        this.modes = {
            single: new SinglePlayerMode(this),
            coop: new CoopMode(this),
            versus: new VersusMode(this)
        };
        this.currentMode = this.modes.single;
    }

    handleKeyPressed(key) {
        // 使用传入的 key 参数而不是直接使用 keyCode
        if (key === LEFT_ARROW) {
            this.moveDirection1 = -1;
        } else if (key === RIGHT_ARROW) {
            this.moveDirection1 = 1;
        } else if (key === 65) { // 'A' 键
            this.moveDirection2 = -1;
        } else if (key === 68) { // 'D' 键
            this.moveDirection2 = 1;
        } else if (key === 32) { // 空格键
            this.player1.ability.dropGrass();
        } else if (key === ENTER) {
            if (this.state.gameOver) {
                this.reset();
            } else {
                this.player2.ability.dropGrass();
            }
        }
    }

    handleKeyReleased(key) {
        // 使用传入的 key 参数
        if (key === LEFT_ARROW && this.moveDirection1 < 0) {
            this.moveDirection1 = 0;
        } else if (key === RIGHT_ARROW && this.moveDirection1 > 0) {
            this.moveDirection1 = 0;
        } else if (key === 65 && this.moveDirection2 < 0) {
            this.moveDirection2 = 0;
        } else if (key === 68 && this.moveDirection2 > 0) {
            this.moveDirection2 = 0;
        }
    }

    update() {
        if (this.state.paused || this.state.gameOver) return;

        // 使用当前模式来更新游戏
        this.currentMode.update();

        // 生成新的草
        if (millis() - this.lastGrassTime > this.grassInterval) {
            this.grasses.push(new Grass());
            this.lastGrassTime = millis();
        }

        // 更新草的位置
        for (let grass of this.grasses) {
            grass.update();
        }

        // 检查碰撞
        this.collisionHandler.checkCollisions(this);
    }

    draw() {
        background(0);
        
        // 绘制篮子
        this.basket1.draw();
        if (this.state.isPlayAgainstMode) {
            this.basket2.draw();
        }
        
        // 绘制玩家
        this.player1.draw();
        if (this.state.isTwoPlayerMode) {
            this.player2.draw();
        }
        
        // 绘制草
        for (let grass of this.grasses) {
            grass.draw();
        }
        
        // 绘制UI
        this.score.draw(this.state);
        this.lives.draw(this.state);
    }

    reset() {
        this.state = new State();
        this.grasses = [];
        this.player1.reset();
        this.player2.reset();
        this.currentMode.init();
    }

    setMode(modeName) {
        this.currentMode = this.modes[modeName];
        this.currentMode.init();
    }
} 