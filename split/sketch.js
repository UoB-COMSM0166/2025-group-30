// 全局游戏实例
let gameManager;

function setup() {
    createCanvas(800, 600);
    gameManager = new GameManager();
    gameManager.setup();
}

function draw() {
    gameManager.update();
    gameManager.uiManager.render();
}

function keyPressed() {
    gameManager.inputHandler.handleKeyPressed(keyCode);
}

function keyReleased() {
    gameManager.inputHandler.handleKeyReleased(keyCode);
}

function mousePressed() {
    gameManager.inputHandler.handleMousePressed(mouseX, mouseY);
}