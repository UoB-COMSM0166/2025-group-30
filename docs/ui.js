function displayUI() {
    fill(0);
    textSize(20);
    text(`Level ${level}`, width / 2, 30);
    text(`Score: ${score}`, 20, 30);
    text(`Target: ${targetScores[level - 1]}`, 20, 60);
    text(`Time: ${timer}s`, 20, 90);
}

function displayStartScreen() {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    text("Click Start to Begin", width / 2, height / 2 - 50);
    
    if (!showModeSelection) {
        // 显示 "Start" 按钮
        fill(0, 255, 0);
        rect(width / 2 - 50, height / 2 - 20, 100, 40);
        fill(0);
        textSize(24);
        text("Start", width / 2, height / 2);
      
        // 显示帮助按钮
        drawHelpButton();
        
        // 显示帮助界面
        if (showHelp) {
            drawHelpScreen();
        }
    } else {
        // 显示模式选择界面
        if (!showTwoPlayerOptions) {
            
            // 显示模式选择按钮
            fill(255, 255, 0);
            rect(width / 2 - 100, height / 2 - 20, 200, 50);
            fill(0);
            textSize(24);
            text("1 Player", width / 2, height / 2 + 5);
            
            fill(255, 192, 0);
            rect(width / 2 - 100, height / 2 + 60, 200, 50);
            fill(0);
            textSize(24);
            text("2 Players", width / 2, height / 2 + 85);
          
          // 绘制居中的 "Back" 按钮
            fill(255, 0, 0); // 红色返回键
            rect(width / 2 - 50, height / 2 + 130, 100, 40); // 居中显示
            fill(255);
            textSize(20);
            text("Back", width / 2, height / 2 + 150);
        } else {
            // 显示双人模式选项（合作或对抗）
            displayTwoPlayerOptions();
        }
    }
}

function displayTwoPlayerOptions() {
    fill(255, 255, 0);
    rect(width / 2 - 100, height / 2 - 20, 200, 50);
    fill(0);
    textSize(24);
    text("Play Together", width / 2, height / 2 + 5);
    
    fill(255, 192, 0);
    rect(width / 2 - 100, height / 2 + 60, 200, 50);
    fill(0);
    textSize(24);
    text("Play Against", width / 2, height / 2 + 85);
}

function displayLevelUpScreen() {
    background(220);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Congratulations!", width / 2, height / 2 - 50);
    
    fill(0, 255, 0);
    rect(width / 2 - 100, height / 2, 200, 50);
    fill(255);
    text("Next Level", width / 2, height / 2 + 25);
    
    fill(255, 0, 0);
    rect(width / 2 - 100, height / 2 + 70, 200, 50);
    fill(255);
    text("Home", width / 2, height / 2 + 95);
}

function displayGameOverScreen() {
    background(220);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 50);
    if (isPlayAgainstMode) {
        if (score1 > score2) {
            text("Player 1 Wins!", width / 2, height / 2 - 10);
        } else if (score2 > score1) {
            text("Player 2 Wins!", width / 2, height / 2 - 10);
        } else {
            text("It's a Tie!", width / 2, height / 2 - 10);
        }
    }
    textSize(20);
    text("Press ENTER to Restart", width / 2, height / 2+100);
}

function displayLives() {
    let heartX = 20;
    let heartY = 180;
    for (let i = 0; i < 3; i++) {
        fill(i < lives1 ? 'red' : 'gray');
        ellipse(30 + i * 30, heartY, 20, 20);
    }
    if (isTwoPlayerMode) {
        for (let i = 0; i < 3; i++) {
            fill(i < lives2 ? 'red' : 'gray');
            ellipse(width - 90 + i * 30, heartY, 20, 20);
        }
    }
}

function drawHelpButton() {
    fill(255);
    rect(width - 140, 20, 50, 30);
    fill(0);
    textSize(16);
    text("Help", width - 115, 35);
}

function drawHelpScreen() {
    fill(255);
    rect(width / 2 - 150, height / 2 - 100, 300, 250);
    fill(0);
    textSize(18);
    textAlign(CENTER,CENTER);
    text("Game Rules", width / 2, height / 2 - 70);
    textSize(14);
    text("Use A/D keys to move", width / 2, height / 2 - 40);
    text("Catch up to 5 grass piles", width / 2, height / 2 - 20);
    text("Move left to basket & press SPACE", width / 2, height / 2);
    text("Dropped grass counts as score", width / 2, height / 2 + 20);
    text("Meet the target score before time runs out!", width / 2, height / 2 + 40);
    
    fill(255, 165, 0);
    rect(width / 2 - 50, height / 2 + 80, 100, 40);
    fill(0);
    textSize(16);
    text("Home", width / 2, height / 2 + 100);
}

function drawMenuButton() {
    fill(255, 0, 0);
    rect(width - 70, 20, 50, 30);
    fill(255);
    textSize(16);
    text("Menu", width - 45, 35);
}

function drawPauseMenu() {
    fill(200);
    rect(width / 2 - 75, height / 2 - 50, 150, 170);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Pause Menu", width / 2, height / 2 - 30);
    
    fill(0, 255, 0);
    rect(width / 2 - 50, height / 2 - 10, 100, 30);
    fill(0);
    text("Continue", width / 2, height / 2 + 5);
    
    fill(255, 165, 0);
    rect(width / 2 - 50, height / 2 + 30, 100, 30);
    fill(0);
    text("Home", width / 2, height / 2 + 45);
    
    fill(255, 0, 0);
    rect(width / 2 - 50, height / 2 + 70, 100, 30);
    fill(0);
    text("Restart", width / 2, height / 2 + 85);
}