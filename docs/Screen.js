class Screen {
    constructor(screenManager) {
        this.screenManager = screenManager;
    }

    display() {}

    mousePressed() {
        if (!this.buttons) return;
        for (let button of this.buttons) {
            // 计算按钮的点击区域
            let buttonTop = button.y - button.buttonHeight/2;
            let buttonBottom = button.y + button.buttonHeight/2;
            let buttonLeft = button.x - button.buttonWidth/2;
            let buttonRight = button.x + button.buttonWidth/2;

            // 检查鼠标是否在按钮区域内
            if (window.mouseXGame > buttonLeft && 
                window.mouseXGame < buttonRight && 
                window.mouseYGame > buttonTop && 
                window.mouseYGame < buttonBottom) {
                
                button.action();
                return; // 防止点击多个按钮
            }
        }
    }
        
    keyPressed() {}

    keyReleased() {}
}
