class Grass {
    constructor(x, y, isLeft) {
        this.x = x;
        this.y = y;
        this.size1 = 40;
        this.size2 = 60;
        this.speed = 2;
        this.isLeft = isLeft;
    }

    update() {
        if ((gameManager.state.isPlayAgainstMode && 
            (gameManager.player1.paused || gameManager.player2.paused || gameManager.state.paused)) || 
            (!gameManager.state.isPlayAgainstMode &&  (gameManager.player1.paused || gameManager.player2.paused ||gameManager.state.paused))) {
            return;
        }
        this.y += this.speed;
        if (gameManager.state.isPlayAgainstMode) {
            if (this.isLeft && this.x > width / 2) {
                this.x = 60 + width / 2 - this.size2;
            } else if (!this.isLeft && this.x < width / 2) {
                this.x = 60 + width / 2;
            }
        }
    }

    show() {
        stroke(0);
        fill(0, 255, 0);
        rect(this.x, this.y, this.size2, this.size1);
        noStroke();
    }
}