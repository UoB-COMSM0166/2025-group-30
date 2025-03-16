class Flash {
    constructor(flashDuration){
        this.flashDuration = flashDuration; // represents the number of frames the flashing effect will last
        this.playerIsVisible = true; 
    }

    update() {
        if (this.flashDuration <= 0){
            this.playerIsVisible = true;
            return;
        }
        this.flashDuration--;
        //player will be visible for 5 frames, then invisible for 5 frames,repeating until flashDuration reaches 0
        this.playerIsVisible = frameCount % 10 < 5 
    }

    setFlashDuration(flashDuration) {
        this.flashDuration = flashDuration;
    }

    getFlashDuration() {
        return this.flashDuration;
    }
}