class Screen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.focusedButtonIndex = -1; // Track currently focused button
    }

    display() { }

    mousePressed() {
        if (!this.buttons) return;
        for (let button of this.buttons) {
            // 计算按钮的点击区域
            let buttonTop = button.y - button.buttonHeight / 2;
            let buttonBottom = button.y + button.buttonHeight / 2;
            let buttonLeft = button.x - button.buttonWidth / 2;
            let buttonRight = button.x + button.buttonWidth / 2;

            // 检查鼠标是否在按钮区域内
            if (window.mouseXGame > buttonLeft &&
                window.mouseXGame < buttonRight &&
                window.mouseYGame > buttonTop &&
                window.mouseYGame < buttonBottom) {
                // 播放按钮点击音效
                this.screenManager.soundManager.playSound('buttonClick');
                button.action();
                return; // 防止点击多个按钮
            }
        }
    }

    doubleClicked() { }

    keyPressed() {
        if (!this.buttons) return;

        // Prevent default tab behavior
        if (keyCode === TAB) {
            // Prevent the default tab behavior
            event.preventDefault();

            if (keyIsDown(SHIFT)) {
                // Shift+Tab: Move focus to previous button
                this.focusedButtonIndex = (this.focusedButtonIndex - 1 + this.buttons.length) % this.buttons.length;
            } else {
                // Tab: Move focus to next button
                this.focusedButtonIndex = (this.focusedButtonIndex + 1) % this.buttons.length;
            }
            return;
        }

        // Handle Enter/Space to activate focused button
        if ((keyCode === ENTER || keyCode === 32) && this.focusedButtonIndex >= 0) {
            this.buttons[this.focusedButtonIndex].action();
            return;
        }
    }

    keyReleased() { }

    mouseReleased() { }

    mouseDragged() { }

    doubleClicked() { }
}
