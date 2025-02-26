class SingleHelp {

    displayHelp() {
        fill(255);
        rect(width / 2 - 150, height / 2 - 100, 300, 250);
        fill(0);
        textSize(18);
        textAlign(CENTER,CENTER);
        text("Game Rules", width / 2, height / 2 - 70);
        textSize(14);
        text("<-: LEFT", width / 2, height / 2 - 40);
        text("->: RIGHT", width / 2, height / 2 - 20);
        text("You can only catch up to 5 haystack", width / 2, height / 2);
        text("Move to basket & press SPACE to empty your pile", width / 2, height / 2+20);

        this.drawStartButton();
        this.drawHomeButton();       
    }

    drawStartButton() {
        let buttonWidth = 100;
        let buttonHeight = 40;
        let buttonX = width/4*3;;
        let buttonY = height/5*4;

        fill(0, 255, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        textSize(16);
        text("Start", buttonX+50, buttonY+20);

        //click start button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            domain = "single";
        }
    }

    drawHomeButton() {
        let buttonWidth = 100;
        let buttonHeight = 40;
        let buttonX =  width/4 - buttonWidth/2;
        let buttonY = height/5*4;

        fill(255, 165, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        textSize(16);
        text("Home",buttonX+50, buttonY+20);

        //click home button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            domain = "home";
        }
    }

}