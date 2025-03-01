class GameState {
    constructor() {
        //--Scores and lives
        this.score1 = 0;
        this.score2 = 0;
        this.lives1 = 3;
        this.lives2 = 3;

        //--game modes and levels
        this.mode = "1 Player";
        this.isTwoPlayerMode = false;
        this.level = 1;
        this.targetScores = [5, 50];
        this.timer = 60;

        //--Flow flags
        this.gameStarted = false;
        this.startGame = false;      
        this.paused = false;
        this.gameOver = false;       
        this.isPlayAgainstMode = false;

        //--UI flags
        this.showMenu = false;
        this.showModeSelection = false;
        this.showTwoPlayerOptions = false;
        this.showHelp = false;
        this.showLevelUpScreen = false;

        //--timer and flash effect
        this.flashPaused = false;
        this.isFlashVisible = true;
    }

    reset() {
        //--Scores and lives
        this.score1 = 0;
        this.score2 = 0;
        this.lives1 = 3;
        this.lives2 = 3;

        //--game modes and levels
        this.isTwoPlayerMode = false;
        this.level = 1;

        //--flow flags
        this.gameStarted = false;
        this.startGame = false;
        this.paused = false;
        this.gameOver = false;
        this.isPlayAgainstMode = false;
        
        //--UI flags  
        this.showTwoPlayerOptions = false;
        this.showLevelUpScreen = false;
        
        //--timer and flash effect
        this.isFlashVisible = true;
    }
}