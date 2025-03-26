let screenManager;
let page;
const baseWidth = 800;
const baseHeight = 600;
let bgImage;

function preload() {
    bgImage = loadImage('./assets/barn.webp'); 
}

function setup() {
    createCanvas(baseWidth, baseHeight);
    page = new Page();
    window.page = page;
    screenManager = new ScreenManager();
  
    // Add visibility change event listener
    document.addEventListener('visibilitychange', () => screenManager.handleVisibilityChange());

    // 预加载篮子图片
    Basket.basketImage = loadImage('assets/basket.webp');
}

function draw() {
    push();

    page.applyTransformation();

    // 设置背景图片模式为覆盖整个画布
    imageMode(CORNER);
    if (bgImage) {
        image(bgImage, 0, 0, baseWidth, baseHeight); // 使用 baseWidth 和 baseHeight
    }

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











