class GameScreen extends Screen {
    constructor(screenManager) {
        // --- basic settings ---
        super(screenManager);

        this.player = new Player();

        // this.gameOverScreen = new GameOverScreen(this.screenManager,this);
        // this.levelSuccessScreen = new LevelSuccessScreen(this.screenManager, this);
        this.pauseScreen = new PauseScreen(this.screenManager, this);
    }

    // --- initialising the game state ---
    startGrassDrop() {}
    stopGrassDrop() {}  

    // --- main game logic ----
    startLevelTimer(){}
    updateGrass(){}
    

    clearStats(){} //clear current player stats

    reset(){} //reset to level 1

    restart(){} //restart from the current level

    displayLives(){}

    displayUI(){}
    
    //--- Move to next level ---
    startNextLevel(){}

    keyPressed(){}

    keyReleased(){}

}