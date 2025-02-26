class Single {
    constructor() {
        this.player = new Player();
        this.basket = new Basket();
        this.level = 1;
        this.targetScores = 5;
        this.score = 0;
        this.timer = 60;
        this.dropGrass = [];
        this.grassDropInterval = null;

        this.startGrassDrop(); //start dropping grass immediately 
    }

    displaySingle(){       
        this.player.move();        
        this.player.update();
        this.basket.show();

        this.showGrass();
        this.updateGrass();

        this.displayLives();
        this.displayUI();
    }

    startGrassDrop() {
        if (this.grassDropInterval) { clearInterval(this.grassDropInterval);}

        this.dropGrass = []; //empty the grass piles

        this.grassDropInterval = setInterval(() => {
            this.dropGrass.push(new Grass(random(200, width - 100), 10));            
        }, 2000); //grass falls every 2 second 
        //startLevelTimer();       
    }

    stopGrassDrop() {
        if (this.grassDropInterval) {
            clearInterval(this.grassDropInterval);
            this.grassDropInterval = null;
        }
    }

    showGrass() {
        for (let grass of this.dropGrass) {  
            grass.show();  // Only show, update is handled in updateGrass()
        }
    }

    updateGrass() { //update the grass from this.dropGrass if caught or missed
        for (let i = this.dropGrass.length - 1; i >= 0; i--) {
             
            this.dropGrass[i].update();    
            
            if (this.dropGrass[i].y > height || this.player.catchGrass(this.dropGrass[i])) {
                this.dropGrass.splice(i, 1);  // Remove if off-screen or caught
            }
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
        text(`Level ${this.level}`, width / 2, 30);
        text(`Score: ${this.score}`, 20, 30);
        text(`Target: ${this.targetScores}`, 20, 60);
        text(`Time: ${this.timer}s`, 20, 90);
    }
    
}