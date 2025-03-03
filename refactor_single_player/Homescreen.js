class HomeScreen extends Screen {
    // constructor(screenManager) {
    //     super(screenManager);
    //     //this.screenManager = screenManager;
    // }

    display() {
        background(220);
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(30);
        text("Welcome to Haystacking!", width / 2, height / 3);
        textSize(20);
        text("Click anywhere to start", width / 2, height / 2);
    }

    mousePressed() { //go to menuscreen
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
