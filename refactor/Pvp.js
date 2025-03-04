class Pvp extends Screen { // player with higher score in the set time wins
    constructor(screenManager, level=1, timer=30, grassDropDelay=2000) {
        // --- basic settings ---
        super(screenManager);

        this.pauseScreen = new PauseScreen(this.screenManager, this);
        this.pvpLevelUpScreen = new PvpLevelUpScreen(this.screenManager,this);

        this.player1 = new Player("pvpLeft");
        this.basket1 = new Basket("left");
        this.player1.basket = this.basket1;
        this.grass1 = []; //collection of falling grass
        
        this.player2 = new Player("pvpRight");
        this.basket2 = new Basket("right");
        this.player2.basket = this.basket2;
        this.grass2 = []; //collection of falling grass
        
        // --- level related settings ---
        this.level = level;
        this.timer = timer;       
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.timeLeft= timer;
        this.grassDropInterval = null; //manage how often a grass drops
        this.levelTimerInterval = null; //manage how often the timer goes down i.e. 1 second

    }

    display(){ 
        background(200); 
        this.basket1.show(); 
        this.basket2.show(); 

        if (this.screenManager.currentScreen === this){
            this.player1.move();  
            this.player2.move();   
            this.updateGrass();     
        }

        this.showGrass();
        this.player1.show(); //show player with grass 
        this.player2.show();        

        this.displayUI();      
    }

    // --- initialising the game state ---

    startGrassDrop() { //
        if (this.grassDropInterval) clearInterval(this.grassDropInterval);
        // if (this.grassDropInterval2) clearInterval(this.grassDropInterval2);
        
        this.grass1 = []; //empty the grass piles
        this.grass2 = [];

        //grass drops start immediately 
        this.grass1.push(new Grass(random(200, width/2 - 100), 10));
        this.grass2.push(new Grass(random(width/2, width-100), 10));

        this.grassDropInterval1 = setInterval(() => {
            if (this.player1.flash.flashDuration === 0 && this.screenManager.currentScreen === this){ //grass drop continue if flashing is not on && game is not paused
                this.grass1.push(new Grass(random(200, width/2 - 100), 10));
                console.log("start grass drop 1");
            }   
            if (this.player2.flash.flashDuration === 0 && this.screenManager.currentScreen === this){ //grass drop continue if flashing is not on && game is not paused
                this.grass2.push(new Grass(random(width/2, width-100), 10));
                console.log("start grass drop 1");
            }         
        }, this.grassDropDelay); //grass falls every 2 seconds 
         
        this.startLevelTimer();  
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
            console.log("stop grass drop for 1 and 2");
        }
        this.stopLevelTimer();
    }

    // --- main game logic ----
    updateGrass() { //update the grass from this.grass based on if caught or missed   
        this.updateGrass1();
        this.updateGrass2();
    }

    updateGrass1() { //update the grass from this.grass1 based on if caught or missed   
        for (let i = this.grass1.length - 1; i >= 0; i--) {
            if (this.player1.flash.flashDuration === 0 && this.screenManager.currentScreen === this) this.grass1[i].fall(); //stop grass fall if flashing is on or game is paused
            
            if (this.grass1[i].y > height) { //if miss a grass, player flashes
                this.player1.flash.flashDuration = 30;
            }              
            
            if (this.grass1[i].y > height || this.player1.catchGrass(this.grass1[i])) {
                this.grass1.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    updateGrass2() { //update the grass from this.grass2 based on if caught or missed   
        for (let i = this.grass2.length - 1; i >= 0; i--) {
            if (this.player2.flash.flashDuration === 0 && this.screenManager.currentScreen === this) this.grass2[i].fall(); //stop grass fall if flashing is on or game is paused
            
            if (this.grass2[i].y > height) { //if miss a grass, player flashes
                this.player2.flash.flashDuration = 30;
            }              
            
            if (this.grass2[i].y > height || this.player2.catchGrass(this.grass2[i])) {
                this.grass2.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }
    
    showGrass(){ //draw the grass
        for (let i = this.grass1.length - 1; i >= 0; i--) this.grass1[i].show();
        for (let i = this.grass2.length - 1; i >= 0; i--) this.grass2[i].show();
    }

    startLevelTimer() { 
        console.log("start level timer for player 1 and 2");
        if (this.levelTimerInterval) clearInterval(this.levelTimerInterval);
        this.levelTimerInterval = setInterval(() => {
            if (this.timeLeft > 0) { 
                if (this.screenManager.currentScreen === this) this.timeLeft--; //time goes down for both player even if one player is flashing
            }
            else { //check when times run out
                this.stopGrassDrop();
                this.screenManager.changeScreen(this.pvpLevelUpScreen);
            }
        }, 1000);
    }

    stopLevelTimer() {      
        if (this.levelTimerInterval) {
            clearInterval(this.levelTimerInterval);
            this.levelTimerInterval = null;
        }
        console.log("stop level timer for 1 and 2");
    }

    clearStats(){
        this.player1.reset();
        this.player2.reset();
        this.timeLeft = this.timer;
        this.stopGrassDrop();     
    }

    reset(){ //reset to level 1
        this.level = 1;
        this.timer = 30;
        this.grassDropDelay = 2000;

        this.restart();
    }

    restart() { //restart from the current level
        this.clearStats();
        this.startGrassDrop();
    }

    displayUI() {
        stroke(0);
        line(width / 2, 0, width / 2, height);
        noStroke();

        fill(0);
        textSize(20);
        
        textAlign(CENTER);
        text(`Level ${this.level}`, width / 2, 30);
        text(`Time: ${this.timeLeft}s`, width/2, 60);
        
        textAlign(LEFT);
        text(`Score: ${this.player1.score}`, 20, 30);

        textAlign(RIGHT);
        text(`Score: ${this.player2.score}`, width - 20, 30);
    }
    
    //--- Move to next level ---
    startNextLevel() { 
        this.level++;
        this.timer += 30;
        this.grassDropDelay = max(500, this.grassDropDelay-500);

        this.restart();
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player2.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player2.dir = -1;
        else if (keyCode === ENTER) this.player2.emptyGrass();

        else if (keyCode === 68) this.player1.dir = 1; // D
        else if (keyCode === 65) this.player1.dir = -1; // A
        else if (keyCode === 32) this.player1.emptyGrass(); //spacebar    
        
        else if (keyCode === ESCAPE) {
            this.screenManager.changeScreen(this.pauseScreen);
        }
    }

    keyReleased() {
        if (keyCode === 68 || keyCode === 65) this.player1.dir = 0;
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player2.dir = 0;
    }
}