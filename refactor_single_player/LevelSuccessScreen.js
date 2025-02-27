class LevelSuccessScreen extends Screen { //for single mode
    constructor(screenManager, level = 1, score = 5, targetScores = 5) {
        super(screenManager);
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;

        // Buttons for navigating
        this.buttons = [
            {
                label: "Next Level",
                x: width / 4 * 3 - 50,
                y: height / 5 * 4,
                color: "rgb(0, 200, 0)",
                action: () => {
                    this.screenManager.single.levelUp();
                    return this.screenManager.single;
                }
            },
            {
                label: "Menu",
                x: width / 4 - 50,
                y: height / 5 * 4,
                color: "rgb(255, 165, 0)",
                action: () => this.screenManager.menuScreen
            }
        ];
    }

    // Display the Level Success screen
    display() {
        background(200);
        fill(255);
        rect(width / 2 - 150, height / 2 - 100, 300, 250);  // Display box for message
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`Level ${this.level} Complete!`, width / 2, height / 2 - 70);
        textSize(16);
        text(`Score: ${this.score}`, width / 2, height / 2);
        text(`Target: ${this.targetScores}`, width / 2, height / 2 + 20);

        // Display buttons
        for (let button of this.buttons) {
            fill(button.color);
            let buttonWidth = 120;
            let buttonHeight = 40;
            rect(button.x, button.y - 20, buttonWidth, buttonHeight);
            fill(0);
            textSize(16);
            text(button.label, button.x + 60, button.y);
        }
    }

    // mouse clicks on buttons
    mousePressed() {
        let buttonWidth = 120;
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

    // Update the content of the LevelSuccessScreen
    update(level, score, targetScores) {
        this.level = level;
        this.score = score;
        this.targetScores = targetScores;
    }
}
