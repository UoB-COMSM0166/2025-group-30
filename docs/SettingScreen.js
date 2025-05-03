class SettingScreen extends Screen {
    constructor(screenManager, previousScreen = null) {
        super(screenManager);
        this.previousScreen = previousScreen || screenManager.menuScreen;
        
        // 加载背景图片和音量图标
        this.backgroundImage = loadImage('assets/helpscreen.webp');
        this.volumeIcon = loadImage('assets/volume.png');
        this.noVolumeIcon = loadImage('assets/no-volume.png');
        
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.sliderWidth = 200;
        this.sliderHeight = 20;
        this.sliderHandleSize = 20;
        this.volumeIconSize = 30; // 音量图标大小
        
        // 初始化滑块位置
        this.musicSliderX = baseWidth/2 - this.sliderWidth/2;
        this.musicSliderY = baseHeight/2 - 50;
        this.soundSliderX = baseWidth/2 - this.sliderWidth/2;
        this.soundSliderY = baseHeight/2 + 50;
        
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
                y: baseHeight/2 + 150,
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    // 返回到之前记录的界面
                    this.screenManager.changeScreen(this.previousScreen);
                }
            }
        ];
    }
    
    display() {
        // 绘制背景图片
        if (this.backgroundImage) {
            let scale = Math.max(
                baseWidth / this.backgroundImage.width,
                baseHeight / this.backgroundImage.height
            );

            let newWidth = this.backgroundImage.width * scale;
            let newHeight = this.backgroundImage.height * scale;

            let x = (baseWidth - newWidth) / 2;
            let y = (baseHeight - newHeight) / 2;

            image(this.backgroundImage, x, y, newWidth, newHeight);
        }

        // 绘制蓝色边框
        stroke(53, 97, 140);
        strokeWeight(10);
        noFill();
        rect(5, 5, baseWidth - 10, baseHeight - 10);
        noStroke();

        // 添加半透明白色覆盖层
        fill(255, 255, 255, 255 * 0.65);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);
        
        // 标题
        fill(53, 97, 140);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("SETTINGS", baseWidth/2, baseHeight/2 - 150);
        
        // 音乐音量控制
        this.drawVolumeControl(
            "Music Volume",
            baseWidth/2,
            baseHeight/2 - 50,
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
            baseHeight/2 + 50,
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
        for (let button of this.buttons) {
            rectMode(CENTER);
            
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;
            
            stroke(53, 97, 140);
            strokeWeight(3);
            if (isHovered) {
                fill(227, 249, 253);
            } else {
                fill(207, 239, 246);
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
        const musicMuteBtnY = baseHeight/2 - 50;
        const soundMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const soundMuteBtnY = baseHeight/2 + 50;
        
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
        this.musicSliderX = newX; // 直接使用约束后的位置
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
        this.soundSliderX = newX; // 直接使用约束后的位置
        this.screenManager.soundManager.setSoundVolume(volume);
    }
    
    isMouseOverSlider(sliderX, sliderY) {
        // 修改2: 点击区域分为两部分
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