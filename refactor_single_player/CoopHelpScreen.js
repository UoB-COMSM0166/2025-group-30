class CoopHelpScreen extends Screen {
    // constructor(screenManager) {
    //     this.screenManager = screenManager;
    // }

    display() {
        background(230);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Co-op Mode Help", width / 2, height / 4);
        text("Work together to catch haystacks and reach the goal!", width / 2, height / 2);
        text("Click to start!", width / 2, (3 * height) / 4);
    }

    mousePressed() {
        //this.screenManager.changeScreen(new CoopMode(1));  // Start Level 1
    }
}