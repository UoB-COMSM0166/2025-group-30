let player;
let grassPiles = [];
let basket;
let score = 0;
let lives = 3;
let gameOver = false;
let moveDirection = 0;
let flashTimer = 0;
let paused = false;
let showMenu = false;
let showModeSelection = false;
let startGame = false;
let mode = "1 Player"; //default mode
let grassDropInterval;
let level = 1;
let targetScores = [5, 50];
let timer = 60;
let levelTimerInterval;
let showLevelUpScreen = false;
let flashPaused = false;
let isFlashVisible = true;
let showHelp = false;

function setup() {
    createCanvas(800, 600);
    player = new Player();
    basket = new Basket();
}

function draw() {
    background(220);
    
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
    
    if (flashTimer > 0 && !flashPaused) {
        if (!flashPaused) {
            flashTimer--;
            isFlashVisible = frameCount % 10 < 5;
        }
    
        if (flashTimer === 0 && lives > 0) {
            paused = false;
        } else if (flashTimer === 0 && lives <= 0) {
            gameOver = true;
        }
    }
    
    if (!paused) {
        player.move(moveDirection);
    }
    //player.update();
    player.show();
    basket.show();
    
    for (let i = grassPiles.length - 1; i >= 0; i--) {
        if (!paused) {
            grassPiles[i].update();
        }
        grassPiles[i].show();
        
        if (!paused && grassPiles[i].y > height) {
            lives--;
            flashTimer = 60;
            paused = true;
            grassPiles.splice(i, 1);
            if (lives <= 0) {
                flashTimer = 60; //flash before gameover screen
            }
        } else if (!paused && player.catchGrass(grassPiles[i])) {
            grassPiles.splice(i, 1);
        }
    }
    
    fill(0);
    textSize(20);
    
    textAlign(CENTER);
    text(`Level ${level}`, width / 2, 30);

    textAlign(LEFT);
    text(`Score: ${score}`, 20, 30);
    text(`Target: ${targetScores[level - 1]}`, 20, 60);
    text(`Time: ${timer}s`, 20, 90);

    //text(`FPS: ${Math.round(frameRate())}`, 20, 180);
    
    displayLives();
  
    textAlign(CENTER);

    drawMenuButton();
    if (showMenu) {
        drawPauseMenu();
    }
}

function keyPressed() {
    if (gameOver && keyCode === ENTER) restartGame();
    if (!paused) {
        if (keyCode === LEFT_ARROW) moveDirection = -1;
        else if (keyCode === RIGHT_ARROW) moveDirection = 1;
        else if (keyCode === 32) player.dropGrass();
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) moveDirection = 0;
}

function mousePressed() {
    if (!startGame) {
        if (!showModeSelection) {
            if (showHelp) {
                if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                    mouseY > height / 2 + 80 && mouseY < height / 2 + 120) {
                    showHelp = false;
                    return;
                }
            } else{
                if (mouseX > width - 140 && mouseX < width - 90 && mouseY > 20 && mouseY < 50) {
                    showHelp = true;
                }
                if (!showHelp && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                    mouseY > height / 2 - 20 && mouseY < height / 2 + 20) {
                    startGame = true;
                    paused = false;
                    startGrassDrop();
                }
                if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
                    mouseY > height / 2 + 30 && mouseY < height / 2 + 70) {
                    showModeSelection = true;
                }
                if (mouseX > width - 140 && mouseX < width - 90 && mouseY > 20 && mouseY < 50) {
                    showHelp = true;
                }
            }
            
        } else {
            if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                mouseY > height / 2 - 20 && mouseY < height / 2 + 30) {
                mode = "1 Player";
                showModeSelection = false;
                startGame = true;
                startGrassDrop();
            }
            if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                mouseY > height / 2 + 60 && mouseY < height / 2 + 110) {
                mode = "2 Players";
                showModeSelection = false;
                startGame = true;
                startGrassDrop();
            }
        }
    }
    
    if (mouseX > width - 70 && mouseX < width - 20 && mouseY > 20 && mouseY < 50) {
        showMenu = !showMenu;
        paused = showMenu;
        if (showMenu && flashTimer > 0) {
            flashPaused = true;
            isFlashVisible = true;
        } else if (!showMenu && flashPaused) {
            flashPaused = false;
            isFlashVisible = frameCount % 10 < 5;
        }
    }
    
    if (showMenu) {
        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50) {
            if (mouseY > height / 2 - 10 && mouseY < height / 2 + 20) {
                showMenu = false;
                if (flashPaused) {
                    flashPaused = false;
                } else {
                    paused = false;
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
  
   if (showLevelUpScreen) {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
            if (mouseY > height / 2 && mouseY < height / 2 + 50) {
                levelUp();
            } else if (mouseY > height / 2 + 70 && mouseY < height / 2 + 120) {
                restartGame();
            }
        }
    }  
  
}










