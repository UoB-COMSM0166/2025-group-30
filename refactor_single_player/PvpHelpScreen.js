class PvpHelpScreen extends Screen {
    // constructor(screenManager) {
    //     this.screenManager = screenManager;
    // }

    display() {
        background(230);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("PvP Mode Help", width / 2, height / 4);
        text("Compete against another player to catch the most haystacks!", width / 2, height / 2);
        text("Click to start!", width / 2, (3 * height) / 4);
    }

    mousePressed() {
        //this.screenManager.changeScreen(new PvpMode(1));  // Start Level 1
    }
}