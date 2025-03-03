class HomeScreen extends Screen {
    constructor(screenManager) {
        super(screenManager);
    }

    display() {
        background(220);
        
        // 使用固定的基准尺寸，确保位置一致
        const centerX = 800 / 2; // 使用基准宽度
        const titleY = 600 / 3;  // 使用基准高度
        const instructionY = 600 / 2;
        
        textAlign(CENTER, CENTER);
        fill(0);
        
        textSize(30);
        text("Welcome to Haystacking!", centerX, titleY);
        
        textSize(20);
        text("Click anywhere to start", centerX, instructionY);
    }

    mousePressed() {
        console.log("HomeScreen mousePressed");
        console.log("Mouse position:", mouseX, mouseY);
        console.log("Game mouse position:", window.mouseXGame, window.mouseYGame);
        
        // 转到菜单屏幕
        this.screenManager.changeScreen(this.screenManager.menuScreen);
    }
}
