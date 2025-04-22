class HomeScreen extends Screen {

    display() {
        background(220);

        textAlign(CENTER, CENTER);
        fill(0);
        textSize(30);
        text("Welcome to Haystacking!", baseWidth / 2, baseHeight / 3);

        textSize(20);
        text("Double click to start", baseWidth / 2, baseHeight / 2);
    }

    doubleClicked() {
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
