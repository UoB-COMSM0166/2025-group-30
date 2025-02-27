let gameManager;

function setup() {
    createCanvas(800, 600);
    // 定义键盘常量
    ENTER = 13;
    LEFT_ARROW = 37;
    RIGHT_ARROW = 39;
    
    gameManager = new GameManager();
}

function draw() {
    gameManager.update();
    gameManager.draw();
}

function keyPressed() {
    if (gameManager) {  // 添加检查
        gameManager.handleKeyPressed(keyCode);
    }
}

function keyReleased() {
    if (gameManager) {  // 添加检查
        gameManager.handleKeyReleased(keyCode);
    }
} 