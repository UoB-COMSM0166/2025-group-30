class Screen {
    constructor(screenManager) {
        if (new.target === Screen) {
            throw new TypeError("Cannot instantiate an abstract class 'Screen' directly.");
        }
        this.screenManager = screenManager;
    }

    display() {
        throw new Error("display() must be implemented by subclass.");
    }

    mousePressed() {
        //throw new Error("mousePressed() must be implemented by subclass.");
    }

    keyPressed() {
         
    }

    keyReleased() {
        
    }
}
