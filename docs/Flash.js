class Flash {
    constructor(flashDuration){
        this.flashDuration = flashDuration; // represents the number of frames the flashing effect will last
        this.showPlayer = true; 
    }

    update() {
        if (this.flashDuration <= 0){
            this.showPlayer = true;
            return;
        }
        this.flashDuration--;
        //player will be visible for 5 frames, then invisible for 5 frames,repeating until flashDuration reaches 0
        this.showPlayer = frameCount % 10 < 5 
    }
}