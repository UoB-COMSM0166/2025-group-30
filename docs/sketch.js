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

function mouseMoved() {
    // 更新鼠标坐标
    page.setupMouseCoordinates();
}

function keyPressed() {
    screenManager.keyPressed(); // Calls keyPressed in ScreenManager
}

function keyReleased() {
    screenManager.keyReleased(); // Calls keyReleased in ScreenManager
}

// 窗口大小改变时的处理
function windowResized() {
    // 页面管理器已通过事件监听处理窗口大小变化
    // 这里只需要确保mouseXGame和mouseYGame得到更新
    page.setupMouseCoordinates();
}











