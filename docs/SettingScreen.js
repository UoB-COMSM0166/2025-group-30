class SettingScreen extends Screen {
    constructor(screenManager, previousScreen = null) {
        super(screenManager);
        this.previousScreen = previousScreen || screenManager.menuScreen;
        
        // Reset button focus
        this.focusedButtonIndex = -1;
        this.controls = ['musicMute', 'music', 'soundMute', 'sound', 'back'];
        
        // Add key repeat control
        this.keyRepeatDelay = 200; // 200ms before key repeat starts
        this.keyRepeatInterval = 1; // 1ms between repeats
        this.lastKeyPressTime = 0;
        this.isKeyRepeating = false;
        this.keyRepeatDirection = 0; // -1 for left, 1 for right, 0 for no repeat
        this.volumeChangeSpeed = 0.01; // 1% change per update
        
        // Preload volume icons and background image
        this.volumeIcon = loadImage('assets/volume.webp');
        this.noVolumeIcon = loadImage('assets/no-volume.webp');
        this.musicIcon = loadImage('assets/music.webp');
        this.musicMuteIcon = loadImage('assets/music1.webp');
        this.backgroundImage = loadImage('assets/board2.webp');
        
        this.buttonWidth = 200;
        this.buttonHeight = 50;
        this.sliderWidth = 200;
        this.sliderHeight = 20;
        this.sliderHandleSize = 20;
        this.volumeIconSize = 30; // Volume icon size
        
        // Calculate settings box position and size
        this.boxWidth = baseWidth * 0.6;
        this.boxHeight = baseHeight * 0.7;
        this.boxX = (baseWidth - this.boxWidth) / 2;
        this.boxY = (baseHeight - this.boxHeight) / 2;
        
        // Initialize slider positions
        this.musicSliderX = baseWidth/2;
        this.musicSliderY = this.boxY + this.boxHeight/3 + 10;
        this.soundSliderX = baseWidth/2;
        this.soundSliderY = this.boxY + this.boxHeight/2 + 50;
        
        this.isDraggingMusic = false;
        this.isDraggingSound = false;
        
        // Get current volume from SoundManager
        this.musicVolume = this.screenManager.soundManager.bgMusicVolume;
        this.soundVolume = this.screenManager.soundManager.soundVolume;
        
        // Set slider positions based on current volume
        this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
        this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
        
        this.buttons = [
            {
                label: "Back",
                x: baseWidth/2,
                y: this.boxY + this.boxHeight - 80, // Move button back to original position
                buttonWidth: this.buttonWidth,
                buttonHeight: this.buttonHeight,
                action: () => {
                    // Return to previously recorded screen
                    this.screenManager.changeScreen(this.previousScreen);
                }
            }
        ];
    }
    
    keyPressed() {
        if (keyCode === TAB) {
            // Prevent the default tab behavior
            event.preventDefault();
            
            if (keyIsDown(SHIFT)) {
                // Shift+Tab: Move focus to previous control
                if (this.focusedButtonIndex === -1) {
                    this.focusedButtonIndex = this.controls.length - 1;
                } else {
                    this.focusedButtonIndex = (this.focusedButtonIndex - 1 + this.controls.length) % this.controls.length;
                }
            } else {
                // Tab: Move focus to next control
                if (this.focusedButtonIndex === this.controls.length - 1) {
                    this.focusedButtonIndex = -1;
                } else {
                    this.focusedButtonIndex = (this.focusedButtonIndex + 1) % this.controls.length;
                }
            }
            this.focusedControl = this.focusedButtonIndex === -1 ? null : this.controls[this.focusedButtonIndex];
            return;
        } else if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            const currentTime = millis();
            const step = keyCode === LEFT_ARROW ? -0.01 : 0.01; // 1% change for first press
            
            if (this.focusedControl === 'music') {
                // First press
                this.musicVolume = constrain(this.musicVolume + step, 0, 1);
                this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
                this.screenManager.soundManager.setBackgroundMusicVolume(this.musicVolume);
                this.lastKeyPressTime = currentTime;
                this.isKeyRepeating = true;
                this.keyRepeatDirection = keyCode === LEFT_ARROW ? -1 : 1;
            } else if (this.focusedControl === 'sound') {
                // First press
                this.soundVolume = constrain(this.soundVolume + step, 0, 1);
                this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
                this.screenManager.soundManager.setSoundVolume(this.soundVolume);
                this.lastKeyPressTime = currentTime;
                this.isKeyRepeating = true;
                this.keyRepeatDirection = keyCode === LEFT_ARROW ? -1 : 1;
            }
        } else if (keyCode === ENTER || keyCode === RETURN) {
            if (this.focusedControl === 'back') {
                this.buttons[0].action();
            } else if (this.focusedControl === 'musicMute') {
                this.toggleMute(true);
            } else if (this.focusedControl === 'soundMute') {
                this.toggleMute(false);
            }
        }
    }
    
    keyReleased() {
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            this.isKeyRepeating = false;
            this.keyRepeatDirection = 0;
            
            // Play sound effect only when releasing the key
            if (this.focusedControl === 'sound') {
                this.screenManager.soundManager.playSound('buttonClick');
            }
        }
    }
    
    display() {
        // Display previous screen
        if (this.previousScreen) {
            this.previousScreen.display();
        }
        
        // Handle key repeat for volume control
        if (this.isKeyRepeating && this.keyRepeatDirection !== 0) {
            const currentTime = millis();
            if (currentTime - this.lastKeyPressTime >= this.keyRepeatDelay) {
                const step = this.keyRepeatDirection * this.volumeChangeSpeed;
                
                if (this.focusedControl === 'music') {
                    this.musicVolume = constrain(this.musicVolume + step, 0, 1);
                    this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
                    this.screenManager.soundManager.setBackgroundMusicVolume(this.musicVolume);
                } else if (this.focusedControl === 'sound') {
                    this.soundVolume = constrain(this.soundVolume + step, 0, 1);
                    this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
                    this.screenManager.soundManager.setSoundVolume(this.soundVolume);
                }
            }
        }
        
        // Draw semi-transparent black background
        fill(0, 0, 0, 180);
        rectMode(CORNER);
        rect(0, 0, baseWidth, baseHeight);
        
        // Set global text style to bold
        textStyle(BOLD);
        textFont('Comic Sans MS'); // Use Comic Sans MS font consistently
        
        // Draw background image and all UI elements
        push(); // Save current drawing state
        imageMode(CORNER);
        image(this.backgroundImage, this.boxX, this.boxY, this.boxWidth, this.boxHeight);
        
        // Title
        fill(0, 0, 0);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("SETTINGS", baseWidth/2, this.boxY + 50);
        
        // Music volume control
        this.drawVolumeControl(
            "Music Volume",
            baseWidth/2,
            this.boxY + this.boxHeight/3 + 10,
            this.musicVolume,
            (value) => {
                this.musicVolume = value;
                this.screenManager.soundManager.setBackgroundMusicVolume(value);
            },
            this.isDraggingMusic,
            this.musicSliderX,
            true // This is music control
        );
        
        // Sound volume control
        this.drawVolumeControl(
            "Sound Volume",
            baseWidth/2,
            this.boxY + this.boxHeight/2 + 50,
            this.soundVolume,
            (value) => {
                this.soundVolume = value;
                this.screenManager.soundManager.setSoundVolume(value);
            },
            this.isDraggingSound,
            this.soundSliderX,
            false // This is sound control
        );
        
        // Display buttons
        for (let i = 0; i < this.buttons.length; i++) {
            const button = this.buttons[i];
            rectMode(CENTER);
            
            let isHovered = window.mouseXGame >= button.x - button.buttonWidth/2 
                && window.mouseXGame <= button.x + button.buttonWidth/2 
                && window.mouseYGame >= button.y - button.buttonHeight/2 
                && window.mouseYGame <= button.y + button.buttonHeight/2;
            
            let isFocused = this.focusedControl === (i === 0 ? 'back' : (i === 1 ? 'sound' : 'music'));
            
            if (isHovered) {
                fill(160, 96, 59); // Darker brown
            } else {
                fill(130, 76, 39); // Dark brown
            }
            if (isFocused) {
                stroke(14, 105, 218);
                strokeWeight(4);
            }
            rect(button.x, button.y, button.buttonWidth, button.buttonHeight, 10);
            
            noStroke();
            fill(255); // White text
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.label, button.x, button.y);
        }
        pop(); // Restore drawing state
        
        // Restore normal text style
        textStyle(NORMAL);
        textFont('sans-serif');
    }
    
    drawVolumeControl(label, x, y, value, onChange, isDragging, sliderX, isMusicControl) {
        const controlType = isMusicControl ? 'music' : 'sound';
        const muteControlType = isMusicControl ? 'musicMute' : 'soundMute';
        const isFocused = this.focusedControl === controlType;
        const isMuteFocused = this.focusedControl === muteControlType;
        
        // Check if mouse is hovering over slider
        const isHovered = !this.isDraggingMusic && !this.isDraggingSound && 
            dist(window.mouseXGame, window.mouseYGame, sliderX, y) <= this.sliderHandleSize/2;

        // Draw label
        fill(0, 0, 0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(label, x, y - 30);
        
        // Draw mute button
        const muteBtnX = x - this.sliderWidth/2 - this.volumeIconSize - 15;
        const muteBtnY = y;
        
        // Check if mouse is hovering over mute button
        const isMuteBtnHovered = dist(window.mouseXGame, window.mouseYGame, muteBtnX, muteBtnY) <= this.volumeIconSize/2;
        
        // Select icon based on volume
        const volumeIcon = (isMusicControl ? this.musicVolume : this.soundVolume) > 0 ? 
            (isMusicControl ? this.musicIcon : this.volumeIcon) : 
            (isMusicControl ? this.musicMuteIcon : this.noVolumeIcon);
        
        // Draw volume icon first
        if (volumeIcon) {
            // Draw mute button background (visible on hover or focus)
            if (isMuteBtnHovered || isMuteFocused) {
                fill(180, 126, 89, 150); // Light brown, semi-transparent
                noStroke();
                ellipse(muteBtnX, muteBtnY, this.volumeIconSize + 10);
            }
            
            // Draw focus indicator for mute button
            if (isMuteFocused) {
                noFill();
                stroke(14, 105, 218);
                strokeWeight(2);
                ellipse(muteBtnX, muteBtnY, this.volumeIconSize + 10);
                noStroke();
            }
            
            // Draw volume icon
            imageMode(CENTER);
            image(volumeIcon, muteBtnX, muteBtnY, this.volumeIconSize, this.volumeIconSize);
        }
        
        // Draw slider background track
        noStroke();
        fill(139, 69, 19, 100); // Dark brown, semi-transparent
        rectMode(CORNER);
        rect(x - this.sliderWidth/2, y - this.sliderHeight/2, this.sliderWidth, this.sliderHeight, 10);
        
        // Draw filled portion
        fill(139, 69, 19, 200); // Dark brown, less transparent
        rect(x - this.sliderWidth/2, y - this.sliderHeight/2, 
            (sliderX - (x - this.sliderWidth/2)) + this.sliderHandleSize/2, 
            this.sliderHeight, 10);
        
        // Draw slider circle
        if (isHovered || isDragging || isFocused) {
            fill(160, 82, 45); // Light brown
            if (isFocused) {
                stroke(14, 105, 218); // Blue highlight for focused state
                strokeWeight(4);
            }
        } else {
            fill(139, 69, 19); // Dark brown
            noStroke();
        }
        ellipseMode(CENTER);
        ellipse(sliderX, y, this.sliderHandleSize);
        
        // Draw volume value text (moved to right of progress bar)
        noStroke();
        fill(0, 0, 0);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(`${Math.round(value * 100)}%`, x + this.sliderWidth/2 + 15, y);

        // Draw focus indicator for the slider track
        if (isFocused) {
            noFill();
            stroke(14, 105, 218);
            strokeWeight(2);
            rectMode(CORNER);
            rect(x - this.sliderWidth/2, y - this.sliderHeight/2, this.sliderWidth, this.sliderHeight, 10);
            noStroke();
        }
    }
    
    mousePressed() {
        // Check if mute button was clicked
        const musicMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const musicMuteBtnY = this.boxY + this.boxHeight/3;
        const soundMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const soundMuteBtnY = this.boxY + this.boxHeight/2 + 50;
        
        // Check if clicking on music slider area
        if (this.isMouseOverSlider(this.musicSliderX, this.musicSliderY)) {
            this.focusedControl = 'music';
            this.isDraggingMusic = true;
            this.updateMusicVolume();
            return;
        }
        
        // Check if clicking on sound slider area
        if (this.isMouseOverSlider(this.soundSliderX, this.soundSliderY)) {
            this.focusedControl = 'sound';
            this.isDraggingSound = true;
            this.updateSoundVolume();
            return;
        }
        
        // Check music mute button
        if (dist(window.mouseXGame, window.mouseYGame, musicMuteBtnX, musicMuteBtnY) <= this.volumeIconSize/2) {
            this.toggleMute(true);
            return;
        }
        
        // Check sound mute button
        if (dist(window.mouseXGame, window.mouseYGame, soundMuteBtnX, soundMuteBtnY) <= this.volumeIconSize/2) {
            this.toggleMute(false);
            return;
        }
        
        // Call parent class mousePressed method to handle button clicks
        super.mousePressed();
    }
    
    toggleMute(isMusic) {
        if (isMusic) {
            if (this.musicVolume > 0) {
                // Save current volume for restoration
                this.lastMusicVolume = this.musicVolume;
                this.musicVolume = 0;
            } else {
                // Restore previously saved volume, or 50% if none exists
                this.musicVolume = this.lastMusicVolume || 0.5;
            }
            this.musicSliderX = baseWidth/2 - this.sliderWidth/2 + (this.musicVolume * this.sliderWidth);
            this.screenManager.soundManager.setBackgroundMusicVolume(this.musicVolume);
        } else {
            if (this.soundVolume > 0) {
                // Save current volume for restoration
                this.lastSoundVolume = this.soundVolume;
                this.soundVolume = 0;
            } else {
                // Restore previously saved volume, or 50% if none exists
                this.soundVolume = this.lastSoundVolume || 0.5;
            }
            this.soundSliderX = baseWidth/2 - this.sliderWidth/2 + (this.soundVolume * this.sliderWidth);
            this.screenManager.soundManager.setSoundVolume(this.soundVolume);
            
            // If unmuting, play a sound effect to demonstrate current volume
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
            // Play sound effect to demonstrate current volume
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
        // Ensure slider circle stays within track bounds
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
        // Ensure slider circle stays within track bounds
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
        
        // Case 1: Direct click on circular slider
        const clickedHandle = dist(window.mouseXGame, window.mouseYGame, sliderX, sliderY) <= this.sliderHandleSize/2;
        
        // Case 2: Click on track area (should jump to click position)
        const clickedTrack = window.mouseXGame >= trackLeft && 
                           window.mouseXGame <= trackRight && 
                           window.mouseYGame >= trackTop && 
                           window.mouseYGame <= trackBottom;
        
        return clickedHandle || clickedTrack;
    }
}