class SettingScreen extends Screen {
    constructor(screenManager, previousScreen = null) {
        super(screenManager);
        this.previousScreen = previousScreen || screenManager.menuScreen;
        
        // 重置按钮焦点
        this.focusedButtonIndex = -1;
        
        // 预加载音量图标
        this.volumeIcon = loadImage('assets/volume.png');
        this.noVolumeIcon = loadImage('assets/no-volume.png');
        
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.sliderWidth = 200;
        this.sliderHeight = 20;
        this.sliderHandleSize = 20;
        this.volumeIconSize = 30; // 音量图标大小
        
        // 计算设置框的位置和大小
        this.boxWidth = baseWidth * 0.6;
        this.boxHeight = baseHeight * 0.7;
        this.boxX = (baseWidth - this.boxWidth) / 2;
        this.boxY = (baseHeight - this.boxHeight) / 2;
        
        // 初始化滑块位置
        this.musicSliderX = baseWidth/2;
        this.musicSliderY = this.boxY + this.boxHeight/3;
        this.soundSliderX = baseWidth/2;
        this.soundSliderY = this.boxY + this.boxHeight/2 + 50; // 调整音效滑块位置
        
        this.isDraggingMusic = false;
        this.isDraggingSound = false;
        
        // 从 SoundManager 获取当前音量
        this.musicVolume = this.screenManager.soundManager.bgMusicVolume;
        this.soundVolume = this.screenManager.soundManager.soundVolume;
        
        // 根据当前音量设置滑块位置
        this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
        this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
        
        this.buttons = [
            {
                label: "Back",
                x: baseWidth/2,
                y: this.boxY + this.boxHeight - 80,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    // 返回到之前记录的界面
                    this.screenManager.changeScreen(this.previousScreen);
                }
            }
        ];
    }
    
    keyPressed() {
        if (keyCode === TAB) {
            // 切换按钮焦点
            this.focusedButtonIndex = (this.focusedButtonIndex + 1) % this.buttons.length;
            // 播放音效
            this.screenManager.soundManager.playSound('buttonClick');
        } else if (keyCode === ENTER || keyCode === RETURN) {
            // 如果当前有按钮被选中，执行其动作
            if (this.focusedButtonIndex >= 0 && this.focusedButtonIndex < this.buttons.length) {
                this.buttons[this.focusedButtonIndex].action();
            }
        }
    }
    
    display() {
        // 显示之前的屏幕
        if (this.previousScreen) {
            this.previousScreen.display();
        }
        
        // 绘制半透明黑色背景
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);
        
        // 绘制白色背景框
        fill(255, 255, 255);
        rectMode(CORNER);
        rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight, 20);
        
        // 绘制蓝色边框
        stroke(53, 97, 140);
        strokeWeight(5);
        noFill();
        rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight, 20);
        noStroke();
        
        // 标题
        fill(53, 97, 140);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("SETTINGS", baseWidth/2, this.boxY + 50);
        
        // 音乐音量控制
        this.drawVolumeControl(
            "Music Volume",
            baseWidth/2,
            this.boxY + this.boxHeight/3,
            this.musicVolume,
            (value) => {
                this.musicVolume = value;
                this.screenManager.soundManager.setBackgroundMusicVolume(value);
            },
            this.isDraggingMusic,
            this.musicSliderX,
            true // 这是音乐控制
        );
        
        // 音效音量控制
        this.drawVolumeControl(
            "Sound Volume",
            baseWidth/2,
            this.boxY + this.boxHeight/2 + 50, // 调整音效控制位置
            this.soundVolume,
            (value) => {
                this.soundVolume = value;
                this.screenManager.soundManager.setSoundVolume(value);
            },
            this.isDraggingSound,
            this.soundSliderX,
            false // 这是音效控制
        );
        
        // 显示按钮
        for (let i = 0; i < this.buttons.length; i++) {
            const button = this.buttons[i];
            rectMode(CENTER);
            
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;
            
            let isFocused = this.focusedButtonIndex === i;
            
            stroke(53, 97, 140);
            strokeWeight(3);
            if (isHovered) {
                fill(227, 249, 253);
            } else {
                fill(207, 239, 246);
            }
            if (isFocused) {
                stroke(14, 105, 218);
                strokeWeight(5);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);
            
            noStroke();
            fill(53, 97, 140);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
    }
    
    drawVolumeControl(label, x, y, value, onChange, isDragging, sliderX, isMusicControl) {
        // 检查鼠标是否悬停在滑块上
        const isHovered = !this.isDraggingMusic && !this.isDraggingSound && 
            dist(window.mouseXGame, window.mouseYGame, sliderX, y) <= this.sliderHandleSize/2;

        // 绘制标签
        fill(53, 97, 140);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(label, x, y - 30);
        
        // 绘制静音按钮
        const muteBtnX = x - this.sliderWidth/2 - this.volumeIconSize - 15;
        const muteBtnY = y;
        
        // 检查鼠标是否悬停在静音按钮上
        const isMuteBtnHovered = dist(window.mouseXGame, window.mouseYGame, muteBtnX, muteBtnY) <= this.volumeIconSize/2;
        
        // 根据音量选择图标
        const volumeIcon = (isMusicControl ? this.musicVolume : this.soundVolume) > 0 ? 
            this.volumeIcon : this.noVolumeIcon;
        
        // 先绘制音量图标
        if (volumeIcon) {
            // 绘制静音按钮背景（悬停时显示）
            if (isMuteBtnHovered) {
                fill(207, 239, 246, 150);
                noStroke();
                ellipse(muteBtnX, muteBtnY, this.volumeIconSize + 10);
            }
            
            // 绘制音量图标
            imageMode(CENTER);
            image(volumeIcon, muteBtnX, muteBtnY, this.volumeIconSize, this.volumeIconSize);
        }
        
        // 绘制滑块背景轨道
        noStroke();
        fill(207, 239, 246);
        rectMode(CORNER);
        rect(x - this.sliderWidth/2, y - this.sliderHeight/2, this.sliderWidth, this.sliderHeight, 10);
        
        // 绘制已填充部分
        fill(53, 97, 140, 150);
        rect(x - this.sliderWidth/2, y - this.sliderHeight/2, 
            (sliderX - (x - this.sliderWidth/2)) + this.sliderHandleSize/2, 
            this.sliderHeight, 10);
        
        // 绘制滑块圆形
        if (isHovered || isDragging) {
            fill(227, 249, 253);
        } else {
            fill(53, 97, 140);
        }
        ellipseMode(CENTER);
        ellipse(sliderX, y, this.sliderHandleSize);
        
        // 绘制音量值文本
        fill(53, 97, 140);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`${Math.round(value * 100)}%`, x, y + 25);
    }
    
    mousePressed() {
        // 检查是否点击了静音按钮
        const musicMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const musicMuteBtnY = this.boxY + this.boxHeight/3;
        const soundMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const soundMuteBtnY = this.boxY + this.boxHeight/2 + 50; // 修正音效静音按钮的Y坐标
        
        // 检查音乐静音按钮
        if (dist(window.mouseXGame, window.mouseYGame, musicMuteBtnX, musicMuteBtnY) <= this.volumeIconSize/2) {
            this.toggleMute(true);
            return;
        }
        
        // 检查音效静音按钮
        if (dist(window.mouseXGame, window.mouseYGame, soundMuteBtnX, soundMuteBtnY) <= this.volumeIconSize/2) {
            this.toggleMute(false);
            return;
        }
        
        // 检查是否点击了音乐滑块
        if (this.isMouseOverSlider(this.musicSliderX, this.musicSliderY)) {
            this.isDraggingMusic = true;
            this.updateMusicVolume();
            return;
        }
        
        // 检查是否点击了音效滑块
        if (this.isMouseOverSlider(this.soundSliderX, this.soundSliderY)) {
            this.isDraggingSound = true;
            this.updateSoundVolume();
            return;
        }
        
        // 调用父类的 mousePressed 方法处理按钮点击
        super.mousePressed();
    }
    
    toggleMute(isMusic) {
        if (isMusic) {
            if (this.musicVolume > 0) {
                // 保存当前音量以便恢复
                this.lastMusicVolume = this.musicVolume;
                this.musicVolume = 0;
            } else {
                // 恢复之前保存的音量，如果没有则恢复50%
                this.musicVolume = this.lastMusicVolume || 0.5;
            }
            this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
            this.screenManager.soundManager.setBackgroundMusicVolume(this.musicVolume);
        } else {
            if (this.soundVolume > 0) {
                // 保存当前音量以便恢复
                this.lastSoundVolume = this.soundVolume;
                this.soundVolume = 0;
            } else {
                // 恢复之前保存的音量，如果没有则恢复50%
                this.soundVolume = this.lastSoundVolume || 0.5;
            }
            this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
            this.screenManager.soundManager.setSoundVolume(this.soundVolume);
            
            // 如果取消静音，播放一个音效来展示当前音量
            if (this.soundVolume > 0) {
                this.screenManager.soundManager.playSound('buttonClick');
            }
        }
    }
    
    mouseReleased() {
        if (this.isDraggingMusic) {
            this.isDraggingMusic = false;
        }
        if (this.isDraggingSound) {
            this.isDraggingSound = false;
            // 播放音效来展示当前音量
            this.screenManager.soundManager.playSound('buttonClick');
        }
    }
    
    mouseDragged() {
        if (this.isDraggingMusic) {
            this.updateMusicVolume();
        }
        if (this.isDraggingSound) {
            this.updateSoundVolume();
        }
    }
    
    updateMusicVolume() {
        // 确保滑块圆形始终在轨道范围内
        let newX = constrain(window.mouseXGame, 
            baseWidth/2 - this.sliderWidth/2, 
            baseWidth/2 + this.sliderWidth/2);
        
        let volume = map(newX, 
            baseWidth/2 - this.sliderWidth/2, 
            baseWidth/2 + this.sliderWidth/2, 
            0, 1);
        
        volume = constrain(volume, 0, 1);
        this.musicVolume = volume;
        this.musicSliderX = newX;
        this.screenManager.soundManager.setBackgroundMusicVolume(volume);
    }
    
    updateSoundVolume() {
        // 确保滑块圆形始终在轨道范围内
        let newX = constrain(window.mouseXGame, 
            baseWidth/2 - this.sliderWidth/2, 
            baseWidth/2 + this.sliderWidth/2);
        
        let volume = map(newX, 
            baseWidth/2 - this.sliderWidth/2, 
            baseWidth/2 + this.sliderWidth/2, 
            0, 1);
        
        volume = constrain(volume, 0, 1);
        this.soundVolume = volume;
        this.soundSliderX = newX;
        this.screenManager.soundManager.setSoundVolume(volume);
    }
    
    isMouseOverSlider(sliderX, sliderY) {
        const trackLeft = baseWidth/2 - this.sliderWidth/2;
        const trackRight = baseWidth/2 + this.sliderWidth/2;
        const trackTop = sliderY - this.sliderHeight/2;
        const trackBottom = sliderY + this.sliderHeight/2;
        
        // 情况1: 直接点击了圆形滑块
        const clickedHandle = dist(window.mouseXGame, window.mouseYGame, sliderX, sliderY) <= this.sliderHandleSize/2;
        
        // 情况2: 点击了轨道区域(此时应该跳转到点击位置)
        const clickedTrack = window.mouseXGame >= trackLeft && 
                           window.mouseXGame <= trackRight && 
                           window.mouseYGame >= trackTop && 
                           window.mouseYGame <= trackBottom;
        
        return clickedHandle || clickedTrack;
    }
}