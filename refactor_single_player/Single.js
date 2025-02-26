class Single {
    constructor() {
        this.player = new Player();
        this.basket = new Basket();
        this.level = 1;
        this.targetScores = 5;
        this.score = 0;
        this.timer = 60;
        this.grass = []; //collection of falling grass
        this.grassDropInterval = null;

        this.startGrassDrop(); //start dropping grass immediately 
    }

    displaySingle(){       
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
        }, 2000); //grass falls every 2 second 
        //startLevelTimer();       
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
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
    
}