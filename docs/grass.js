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
        if ((isPlayAgainstMode && (player1.paused || player2.paused || paused)) || (!isPlayAgainstMode && paused)) {
            return;
        }
        this.y += this.speed;
        if (isPlayAgainstMode) {
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