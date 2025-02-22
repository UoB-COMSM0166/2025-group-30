function restartLevel() {
    player.resetPosition();
    score = 0;
    lives = 3;
    gameOver = false;
    grassPiles = [];
    player.stack = [];
    player.velocity = 0;
    paused = false;
    showMenu = false;
    startGrassDrop();
}

function restartGame() {
    player.resetPosition();
    score = 0;
    lives = 3;
    gameOver = false;
    grassPiles = [];
    player.stack = [];
    player.velocity = 0;
    paused = false;
    startGame = false;
    showModeSelection = false;
    level = 1;
    showLevelUpScreen = false;
    // clearInterval(grassDropInterval);
    // clearInterval(levelTimerInterval);
    startGrassDrop();
}


function startGrassDrop() {
    if (grassDropInterval) {
        clearInterval(grassDropInterval);
    }
    grassPiles = []; //Empty the grasspiles
    grassDropInterval = setInterval(() => {
        if (!gameOver && !paused && startGame) {
            grassPiles.push(new Grass(random(200, width - 100), 10));
        }
    }, 2000);
    startLevelTimer();
}

function startLevelTimer() {
    if (levelTimerInterval) {
        clearInterval(levelTimerInterval);
    }
    timer = 30;
    levelTimerInterval = setInterval(() => {
        if (!paused && startGame) {
            timer--;
            if (timer <= 0) {
                clearInterval(levelTimerInterval);
                if (score >= targetScores[level - 1]) {
                    showLevelUpScreen = true;
                    paused = true;
                } else {
                    gameOver = true;
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
        player.resetPosition();
        player.stack = [];
      
        //player.maxSpeed = 10;
        player.acceleration = 2;
      
        startGrassDrop();
    } else {
        gameOver = true;
    }
}

