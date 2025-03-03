let domain;

let screenManager;
let page;
let home = null, mode = null, singleHelp = null, single = null;

function setup() {
    // 不在这里创建画布，而是由Page类负责
    page = new Page();
    
    // 使page全局可用
    window.page = page;
    
    // 创建屏幕管理器
    screenManager = new ScreenManager();
}

function draw() {
    // 在每帧开始时应用坐标变换
    push();
    page.applyTransformation();
    
    // 显示当前屏幕
    screenManager.display();
    
    // 恢复坐标系统
    pop();
}

function mousePressed() {
    console.log("---- mousePressed in sketch.js ----");
    
    // 使用Page类的方法转换坐标
    page.setupMouseCoordinates();
    
    // 调用屏幕管理器的鼠标点击处理
    screenManager.mousePressed();
}

function mouseMoved() {
    // 更新鼠标坐标
    page.setupMouseCoordinates();
}

function keyPressed() {
    screenManager.keyPressed(); // 调用ScreenManager的按键处理
}

function keyReleased() {
    screenManager.keyReleased(); // 调用ScreenManager的按键释放处理
}

// 窗口大小改变时的处理
function windowResized() {
    // 页面管理器已通过事件监听处理窗口大小变化
    // 这里只需要确保mouseXGame和mouseYGame得到更新
    page.setupMouseCoordinates();
}












