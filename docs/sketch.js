let screenManager;
let page;
const baseWidth = 800;
const baseHeight = 600;

function setup() {
    page = new Page();
    window.page = page;
    screenManager = new ScreenManager();
    // Add visibility change event listener
    document.addEventListener('visibilitychange', () => screenManager.handleVisibilityChange());

}

function draw() {
    push();
    page.applyTransformation();
    screenManager.display();
    pop();
}

function mousePressed() {
    page.setupMouseCoordinates();

    screenManager.mousePressed();
}

function mouseReleased() {
    page.setupMouseCoordinates();
    screenManager.mouseReleased();
}

function mouseDragged() {
    page.setupMouseCoordinates();
    screenManager.mouseDragged();
}

function doubleClicked() {
    screenManager.doubleClick();
}

function mouseMoved() {
    page.setupMouseCoordinates();
}

function keyPressed() {
    // Prevent default behavior for Tab key
    if (keyCode === TAB) {
        event.preventDefault();
    }

    screenManager.keyPressed(); // Calls keyPressed in ScreenManager
}

function keyReleased() {
    screenManager.keyReleased(); // Calls keyReleased in ScreenManager
}

function windowResized() {
    page.setupMouseCoordinates();
}











