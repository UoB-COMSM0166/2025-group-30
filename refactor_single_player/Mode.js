class Mode {

    displayMode() {
        textSize(32);
        textAlign(CENTER, CENTER);

        this.draw1PlayerButton();
        this.drawCoopButton();
        this.drawPvPButton();
    }
    
    draw1PlayerButton() {
        let buttonWidth = 200;
        let buttonHeight = 50;
        let buttonX = width / 2 - buttonWidth/2;
        let buttonY = height/4;
       
        fill(255, 255, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        text("1 Player",buttonX+100, buttonY+25);


        //click 1 player button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            //this.pressedMode = true;
            domain = "singleHelp";
        }
    }

    drawCoopButton() {
        let buttonWidth = 200;
        let buttonHeight = 50;
        let buttonX = width / 2 -100;
        let buttonY = height/2;

        fill(255, 255, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        text("Co-op", buttonX+100, buttonY+25);


        //click coop button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            //this.pressedMode = true;
            domain = "CoopHelp";
        }
    }

    drawPvPButton() {
        let buttonWidth = 200;
        let buttonHeight = 50;
        let buttonX = width / 2 -100;
        let buttonY = height/4*3;

        fill(255, 255, 0);
        rect(buttonX, buttonY, buttonWidth, buttonHeight);
        fill(0);
        text("PvP", buttonX+100, buttonY+25);


        //click coop button logic
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth 
            && mouseY > buttonY && mouseY < buttonY + buttonHeight
            && mouseIsPressed
        ) { 
            domain = "pvpHelp";
        }
    }

}