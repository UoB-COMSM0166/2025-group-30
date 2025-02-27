class GameOverScreen extends Screen { //for single mode
    constructor(screenManager, level, score, targetScores) {
        super(screenManager);
        this.level = level;
        this.score = score;
        this.targetScores = targetScores; // Used for checking if the score met the target

        this.buttons = [
            {
                label: "Home",
                x: width / 4 - 50,
                y: height / 5 * 4,
                color: "rgb(255, 0, 0)", 
                action: () => this.screenManager.homeScreen
            },
            {
                label: "Retry",
                x: width / 4 * 3 - 50,
                y: height / 5 * 4,
                color: "rgb(0, 200, 0)", 
                action: () => {
                    this.screenManager.single.reset();
                    return this.screenManager.single;
                }
            }
        ];
    }

    display() {
        background(200);
        fill(255);
        rect(width / 2 - 150, height / 2 - 100, 300, 250);

        fill(0);
        textSize(18);
        textAlign(CENTER, CENTER);

        text("Game Over", width / 2, height / 2 - 70); // Game over title
        textSize(14);


        text(`Your Score: ${this.score}`, width / 2, height / 2 + 20);
        text(`Target Score: ${this.targetScores}`, width / 2, height / 2 + 40);

        // Display button options
        for (let button of this.buttons) {
            fill(button.color);
            let buttonWidth = 100;
            let buttonHeight = 40;
            rect(button.x, button.y - 20, buttonWidth, buttonHeight);
            fill(0);
            textSize(16);
            text(button.label, button.x + 50, button.y);
        }
    }

    mousePressed() {
        let buttonWidth = 100;
        let buttonHeight = 40;
        for (let button of this.buttons) {
            if (mouseY > button.y - 20 &&
                mouseY < button.y - 20 + buttonHeight &&
                mouseX > button.x &&
                mouseX < button.x + buttonWidth
            ) {
                this.screenManager.changeScreen(button.action());
            }
        }
    }

    // Update the content of the GameOverScreen
    update(level, score, targetScores) {
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;
    }
}
