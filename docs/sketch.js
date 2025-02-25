let player1, player2;
let grassPiles = [];
let basket;
let score1 = 0, score2 = 0;
let lives1 = 3, lives2 = 3;
let gameOver = false;
let moveDirection1 = 0, moveDirection2 = 0;
let flashTimer1 = 0, flashTimer2 = 0;
let paused = false;
let showMenu = false;
let showModeSelection = false;
let startGame = false;
let mode = "1 Player";
let grassDropInterval;
let level = 1;
let targetScores = [5, 50];
let timer = 60;
let levelTimerInterval;
let showLevelUpScreen = false;
let flashPaused = false;
let isFlashVisible = true;
let showHelp = false;
let showTwoPlayerOptions = false;
let isTwoPlayerMode = false;
let isPlayAgainstMode = false;

function setup() {
    createCanvas(800, 600);
    basket1 = new Basket(true);
    basket2 = new Basket(false);
    player1 = new Player(true, basket1);
    player2 = new Player(false, basket2);

    player1.resetPosition(true);
    player2.resetPosition(false);
}

function draw() {
    background(220);
    noStroke();
    fill(0);
    textSize(20);
    textStyle(NORMAL);

    if (isPlayAgainstMode) {
      stroke(0);
      line(width / 2, 0, width / 2, height);
      noStroke(); 
    }

    if (!startGame) {
        displayStartScreen();
        return;
    }

    if (showLevelUpScreen) {
        displayLevelUpScreen();
        return;
    }

    if (gameOver) {
        displayGameOverScreen();
        return;
    }

    if (flashTimer1 > 0 && !flashPaused) {
        flashTimer1--;
        isFlashVisible = frameCount % 10 < 5; 
        if (flashTimer1 === 0 && lives1 > 0) {
            player1.paused = false;
            paused = false;
            isFlashVisible = true;
        } else if (flashTimer1 === 0 && lives1 <= 0) {
            gameOver = true;
        }
    }
  
    if (flashTimer2 > 0 && !flashPaused) {
        flashTimer2--;
        isFlashVisible = frameCount % 10 < 5;
        if (flashTimer2 === 0 && lives2 > 0) {
            player2.paused = false;
            paused = false;
            isFlashVisible = true;
        } else if (flashTimer2 === 0 && lives2 <= 0) {
            gameOver = true;
        }
    }

    if (!player1.paused) {
        player1.move(moveDirection1);
        player1.update();
    }
    player1.show();
    basket1.show();

    if (isTwoPlayerMode) {
        if (!player2.paused) {
            player2.move(moveDirection2);
            player2.update();
        }
        player2.show();
        if (isPlayAgainstMode) {
            basket2.show();
        }
    }
   
    for (let i = grassPiles.length - 1; i >= 0; i--) {
        if ((isPlayAgainstMode && (player1.paused || player2.paused)) || (!isPlayAgainstMode && paused)) {
        } else {
            grassPiles[i].update();
        }
        grassPiles[i].show();

    if (!paused && grassPiles[i].y > height) {
      if (isPlayAgainstMode) {
        if (grassPiles[i].isLeft) {
            lives1--;
            if (lives1 > 0) {
                flashTimer1 = 60;
                player1.paused = true;
            } else {
                gameOver = true;
            }
        } else {
            lives2--;
            if (lives2 > 0) {
                flashTimer2 = 60;
                player2.paused = true;
            } else {
                gameOver = true;
            }
        }
      } else {
        lives1--;
        lives2--;
        if (lives1 > 0 && lives2 > 0) {
            flashTimer1 = 60;
            flashTimer2 = 60;
            paused = true;
        } else {
            gameOver = true;
        }
    }
        grassPiles.splice(i, 1);
        } else if (!paused && player1.catchGrass(grassPiles[i])) {
            grassPiles.splice(i, 1);
        } else if (isTwoPlayerMode && !paused && player2.catchGrass(grassPiles[i])) {
            grassPiles.splice(i, 1);
        }
    }

    fill(0);
    textSize(20);
    textAlign(CENTER);
    text(`Level ${level}`, width / 2, 30);

    textAlign(LEFT);
    text(`Player 1 Score: ${score1}`, 20, 30);
    if (isTwoPlayerMode) {
        text(`Player 2 Score: ${score2}`, 20, 60);
    }
    if (!isPlayAgainstMode) {
        text(`Total Score: ${score1 + score2}`, 20, 90);
        text(`Target: ${targetScores[level - 1]}`, 20, 120);
    }
    text(`Time: ${timer}s`, 20, 150);

    displayLives();

    textAlign(CENTER);
    drawMenuButton();
    if (showMenu) {
        drawPauseMenu();
    }
}

function keyPressed() {
    if (gameOver && keyCode === ENTER) {
        restartGame();
    }
  
    if (!paused) {
        if (keyCode === 65) { // A 键
            moveDirection1 = -1;
        } else if (keyCode === 68) { // D 键
            moveDirection1 = 1;
        } else if (keyCode === 32) { // 空格键
            player1.dropGrass();
        }
        if (isTwoPlayerMode) {
            if (keyCode === LEFT_ARROW) {
                moveDirection2 = -1;
            } else if (keyCode === RIGHT_ARROW) {
                moveDirection2 = 1;
            } else if (keyCode === ENTER) { // 回车键
                player2.dropGrass();
            }
        }
    }
}

function keyReleased() {
    if (keyCode === 65 || keyCode === 68) { // A 或 D 键
        moveDirection1 = 0;
    }
    if (isTwoPlayerMode && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
        moveDirection2 = 0;
    }
}

function mousePressed() {
    if (!startGame) {
        if (!showModeSelection) {
            if (showHelp) {
                // 处理帮助界面的返回按钮
                if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                    mouseY > height / 2 + 80 && mouseY < height / 2 + 120) {
                    showHelp = false;
                    return;
                }
            } else {
                // 处理帮助按钮
                if (mouseX > width - 140 && mouseX < width - 90 && mouseY > 20 && mouseY < 50) {
                    showHelp = true;
                }
                // 处理 "Start" 按钮
                if (!showHelp && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                    mouseY > height / 2 - 20 && mouseY < height / 2 + 20) {
                    // 点击 "Start" 按钮后显示模式选择界面
                    showModeSelection = true;
                }
            }
        } else {
            // 处理模式选择界面的返回键
            if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                mouseY > height / 2 + 130 && mouseY < height / 2 + 170) {
                showModeSelection = false; // 返回主界面
                return;
            }

            if (!showTwoPlayerOptions) {
                // 选择 "1 Player" 模式
                if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                    mouseY > height / 2 - 20 && mouseY < height / 2 + 30) {
                    mode = "1 Player";
                    showModeSelection = false;
                    startGame = true;
                    startGrassDrop();
                }
                // 选择 "2 Players" 模式
                if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                    mouseY > height / 2 + 60 && mouseY < height / 2 + 110) {
                    mode = "2 Players";
                    showTwoPlayerOptions = true;
                }
            } else {
                // 处理双人模式选项
                if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                    mouseY > height / 2 - 20 && mouseY < height / 2 + 30) {
                    mode = "Play Together";
                    isTwoPlayerMode = true;
                    isPlayAgainstMode = false; // 合作模式
                    startGame = true;
                    startGrassDrop();
                }
                if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                    mouseY > height / 2 + 60 && mouseY < height / 2 + 110) {
                    mode = "Play Against";
                    isTwoPlayerMode = true;
                    isPlayAgainstMode = true; // 对抗模式
                    startGame = true;
                    startGrassDrop();
                }
            }
        }
    }

    // 处理菜单按钮的点击
    if (mouseX > width - 70 && mouseX < width - 20 && mouseY > 20 && mouseY < 50) {
        showMenu = !showMenu; // 切换菜单显示状态
        paused = showMenu; // 暂停游戏
        if (showMenu && (flashTimer1 > 0 || flashTimer2 > 0)) {
            flashPaused = true;
            isFlashVisible = true;
        } else if (!showMenu && flashPaused) {
            flashPaused = false;
            isFlashVisible = frameCount % 10 < 5;
        }
    }

    // 处理菜单中的选项
    if (showMenu) {
        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50) {
            if (mouseY > height / 2 - 10 && mouseY < height / 2 + 20) {
                showMenu = false;
                if (flashPaused) {
                    flashPaused = false;
                } else {
                    paused = false; // 恢复游戏
                }
            } else if (mouseY > height / 2 + 30 && mouseY < height / 2 + 60) {
                restartGame();
                showMenu = false;
                startGame = false;
            } else if (mouseY > height / 2 + 70 && mouseY < height / 2 + 100) {
                restartLevel();
                showMenu = false;
            }
        }
    }
}








