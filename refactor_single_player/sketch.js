let domain;

let screenManager;
let home = null, mode = null, singleHelp = null, single = null;

function setup() {
    createCanvas(800, 600);
    screenManager = new ScreenManager();
}

function draw() {
    screenManager.display();   
}

function mousePressed() {
    screenManager.mousePressed();
}

function keyPressed() {
    screenManager.keyPressed(); // Calls keyPressed in ScreenManager
}

function keyReleased() {
    screenManager.keyReleased(); // Calls keyReleased in ScreenManager
}












