// 基础游戏模式类
class GameMode {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    init() {
        // 基础初始化
        this.gameManager.state.score1 = 0;
        this.gameManager.state.score2 = 0;
        this.gameManager.state.lives = 3;
        this.gameManager.player1.stack = [];
        this.gameManager.player2.stack = [];
    }

    update() {
        // 基础更新逻辑
    }
}

// 单人模式
class SinglePlayerMode extends GameMode {
    init() {
        super.init();
        this.gameManager.state.isTwoPlayerMode = false;
        this.gameManager.state.isPlayAgainstMode = false;
    }

    update() {
        this.gameManager.player1.update(this.gameManager.moveDirection1);
    }
}

// 双人合作模式
class CoopMode extends GameMode {
    init() {
        super.init();
        this.gameManager.state.isTwoPlayerMode = true;
        this.gameManager.state.isPlayAgainstMode = false;
        // 设置两个玩家都使用左边的篮子
        this.gameManager.player2.basket = this.gameManager.basket1;
    }

    update() {
        this.gameManager.player1.update(this.gameManager.moveDirection1);
        this.gameManager.player2.update(this.gameManager.moveDirection2);
    }
}

// 双人对抗模式
class VersusMode extends GameMode {
    init() {
        super.init();
        this.gameManager.state.isTwoPlayerMode = true;
        this.gameManager.state.isPlayAgainstMode = true;
        // 设置玩家各自使用对应的篮子
        this.gameManager.player1.basket = this.gameManager.basket1;
        this.gameManager.player2.basket = this.gameManager.basket2;
    }

    update() {
        this.gameManager.player1.update(this.gameManager.moveDirection1);
        this.gameManager.player2.update(this.gameManager.moveDirection2);
    }
} 