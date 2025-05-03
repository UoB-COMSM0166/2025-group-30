class Barrel {
    constructor(position = "left") {
        this.position = position;
        this.x = (position === "left") ? 10 : baseWidth - 160;
        this.y = baseHeight - 150;
        this.w = 150;
        this.h = 150;
        this.score = 0;
        this.targetScore = 0;
        this.barrelImage = loadImage("assets/barrel.webp");
    }

    draw() {
        push(); // Save current drawing state

        // Set color based on score
        if (this.targetScore === 0) {
            tint(255);
        } else {
            let progress = min(this.score / this.targetScore, 1);
            // Transition from gray(128,128,128) to original color(255,255,255)
            let grayValue = lerp(128, 255, progress);
            tint(grayValue, grayValue, grayValue);
        }

        image(this.barrelImage, this.x, this.y, this.w, this.h);

        pop(); // Restore drawing state

        // Display score
        fill(254, 224, 173);
        textSize(20);
        stroke(0);
        strokeWeight(2);
        textStyle(BOLD);
        textAlign(CENTER);
        if (this.targetScore === 0) {
            text(`${this.score}`, this.x + this.w / 2, this.y - 10);
        } else if (this.score >= this.targetScore) {
            text("Target Achieved!", this.x + this.w / 2 + 5, this.y - 35);
            text(`${this.score}/${this.targetScore}`, this.x + this.w / 2, this.y - 10);
        } else {
            text(`${this.score}/${this.targetScore}`, this.x + this.w / 2, this.y - 10);
        }
        noStroke();
        textStyle(NORMAL);

    }

    updateScore(score, targetScore) {
        this.score = score;
        this.targetScore = targetScore;
    }
}
