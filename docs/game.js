function restartLevel() {
    player1.resetPosition(true);
    if (isTwoPlayerMode) {
        player2.resetPosition(false);
    }
    score1 = 0;
    score2 = 0;
    lives1 = 3;
    lives2 = 3;
    gameOver = false;
    grassPiles = [];
    player1.stack = [];
    player2.stack = [];
    paused = false;
    showMenu = false;
    startGrassDrop();
}
function restartGame() {
    player1.resetPosition(true);
    if (isTwoPlayerMode) {
        player2.resetPosition(false);
    }
    score1 = 0;
    score2 = 0;
    lives1 = 3;
    lives2 = 3;
    gameOver = false;
    grassPiles = [];
    player1.stack = [];
    player2.stack = [];
    paused = false;
    startGame = false;
    showModeSelection = false;
    level = 1;
    showLevelUpScreen = false;
    showTwoPlayerOptions = false;
    isTwoPlayerMode = false;
    isPlayAgainstMode = false;
    clearInterval(grassDropInterval);
    clearInterval(levelTimerInterval);
    textStyle(NORMAL);
    noStroke();
}

function startGrassDrop() {
    if (grassDropInterval) clearInterval(grassDropInterval);
    grassPiles = [];
    grassDropInterval = setInterval(() => {
        if (!gameOver && !paused && startGame) {
            if (isPlayAgainstMode) {
              isTwoPlayerMode = true;
                grassPiles.push(new Grass(random(60, width / 2 - 50), 10, true));
                grassPiles.push(new Grass(random(width / 2 + 50, width - 60), 10, false));
            } else {
                grassPiles.push(new Grass(random(60, width - 50), 10, true));
            }
        }
    }, 2000);
    startLevelTimer();
}

function startLevelTimer() {
    if (levelTimerInterval) clearInterval(levelTimerInterval);
    timer = 30;
    levelTimerInterval = setInterval(() => {
        if (!paused && startGame) {
            timer--;
            if (timer <= 0) {
                clearInterval(levelTimerInterval);
                if (isPlayAgainstMode) {
                        gameOver = true;
                } else {
                    if (score1 + score2 >= targetScores[level - 1]) {
                        showLevelUpScreen = true;
                        paused = true;
                    } else {
                        gameOver = true;
                    }
                }
            }
        }
    }, 1000);
}

function levelUp() {
    if (level < targetScores.length) {
        level++;
        showLevelUpScreen = false;
        paused = false;
        player1.resetPosition(true);
        player2.resetPosition(false);
        player1.stack = [];
        player2.stack = [];
        startGrassDrop();
    } else {
        gameOver = true;
    }
}

