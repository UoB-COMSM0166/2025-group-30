class GameState {
    constructor() {
        this.score1 = 0;
        this.score2 = 0;
        this.lives1 = 3;
        this.lives2 = 3;
        this.gameOver = false;
        this.paused = false;
        this.showMenu = false;
        this.showModeSelection = false;
        this.startGame = false;
        this.mode = "1 Player";
        this.level = 1;
        this.targetScores = [5, 50];
        this.timer = 60;
        this.showLevelUpScreen = false;
        this.flashPaused = false;
        this.isFlashVisible = true;
        this.showHelp = false;
        this.showTwoPlayerOptions = false;
        this.isTwoPlayerMode = false;
        this.isPlayAgainstMode = false;
        this.gameStarted = false;
    }

    reset() {
        this.score1 = 0;
        this.score2 = 0;
        this.lives1 = 3;
        this.lives2 = 3;
        this.gameOver = false;
        this.paused = false;
        this.startGame = false;
        this.level = 1;
        this.showLevelUpScreen = false;
        this.showTwoPlayerOptions = false;
        this.isTwoPlayerMode = false;
        this.isPlayAgainstMode = false;
        this.gameStarted = false;
        this.isFlashVisible = true;
    }
}