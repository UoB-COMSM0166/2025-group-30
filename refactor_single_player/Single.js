class Single extends Screen {
    constructor(screenManager, level, targetScores, time, grassDropDelay) {
        super(screenManager);

        this.player = new Player();
        this.basket = new Basket();

        this.level = level;
        this.targetScores = targetScores;
        this.timer = time;
        this.grassDropDelay = grassDropDelay; // in milliseconds

        this.score = 0;
        this.grass = []; //collection of falling grass
        this.grassDropInterval = null;
        this.timerInterval = null;

        this.startGrassDrop(); //start dropping grass immediately 
        this.startLevelTimer(); //start the level timer
    }

    display(){   
        background(200);    
        this.player.move();        
        this.player.update();
        this.basket.show();

        this.updateGrass();

        this.displayLives();
        this.displayUI();
    }

    startGrassDrop() {
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval);}

        this.grass = []; //empty the grass piles

        this.grassDropInterval = setInterval(() => {
            this.grass.push(new Grass(random(200, width - 100), 10));            
        }, this.grassDropDelay); //grass falls every 2 seconds     
    }

    // stopGrassDrop() {
    //     if (this.grassDropInterval) {
    //         clearInterval(this.grassDropInterval);
    //         this.grassDropInterval = null;
    //     }
    // }

    startLevelTimer() {
        if (this.timerInterval) {clearInterval(this.timerInterval);}

        //this.timer = time; //reset the timer at the start of a level
        this.timerInterval = setInterval(() => {
            if (this.timer >0) {
                this.timer--;
            }
            else {
                if (this.score >= this.targetScores) domain = "levelUp"
                else {domain = "gameOver"};
            }
        }, 1000);
    }

    updateGrass() { //update the grass from this.grass if caught or missed
        for (let i = this.grass.length - 1; i >= 0; i--) {
            this.grass[i].show();
            this.grass[i].fall();

            if (this.grass[i].y > height) { //if miss a grass, lives--
                this.player.lives--;
                if (this.player.lives <= 0) {domain="gameOver"};
            }              
            
            if (this.grass[i].y > height || this.player.catchGrass(this.grass[i])) {
                this.grass.splice(i, 1);  // Remove if off-screen or caught
            }
        }
    }

    emptyGrass() { //empty grass to the basket
        if (this.player.x <= this.basket.x + this.basket.w) {
            this.score += this.player.stack.length;
            this.player.stack = [];
            this.player.maxSpeed = 10;
            this.player.acceleration = 2;
        }
    }

    displayLives() {
        let heartX = 20;
        let heartY = 120;
        for (let i = 0; i < 3; i++) {
            fill(i < this.player.lives ? 'red' : 'gray');
            circle(heartX + i * 30, heartY,20);
        }
    }

    displayUI() {
        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Level ${this.level}`, width / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timer}s`, 20, 90);
    }

    keyPressed() { 
        if (keyCode === RIGHT_ARROW) this.player.dir = 1;
        else if (keyCode === LEFT_ARROW) this.player.dir = -1;
        else if (keyCode === 32) this.emptyGrass(); //spacebar      
    }

    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) this.player.dir = 0;
    }

    //mousePressed() {}
    
}