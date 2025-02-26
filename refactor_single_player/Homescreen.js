class Homescreen {

    displayHomescreen() {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Click Start to Begin", width / 2, height / 2 - 50);
    
        //draw start button
        this.drawStartButton();
    }

    drawStartButton() {
        let buttonWidth = 100;
        let buttonHeight = 40;
        let buttonX = width/4*3;
        let buttonY = height/5*4;

        fill(0, 255, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        text("Start", buttonX+50, buttonY+20);

        //click start button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            domain = "mode";
        }
    }
}
