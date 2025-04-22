class HomeScreen extends Screen {

    display() {
        background(220);

        textAlign(CENTER, CENTER);
        fill(0);
        textSize(30);
        text("Welcome to Haystacking!", baseWidth / 2, baseHeight / 3);

        textSize(20);
        text("Press any key to start", baseWidth / 2, baseHeight / 2);
    }

    keyPressed() { //go to menuscreen
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
