class SettingScreen extends Screen {
    constructor(screenManager, previousScreen = null) {
        super(screenManager);
        this.previousScreen = previousScreen || screenManager.menuScreen;
        
        // Reset button focus
        this.focusedButtonIndex = -1;
        
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
            // Toggle button focus
            this.focusedButtonIndex = (this.focusedButtonIndex + 1) % this.buttons.length;
            // Play sound effect
            this.screenManager.soundManager.playSound('buttonClick');
        } else if (keyCode === ENTER || keyCode === RETURN) {
            // If a button is currently selected, execute its action
            if (this.focusedButtonIndex >= 0 && this.focusedButtonIndex < this.buttons.length) {
                this.buttons[this.focusedButtonIndex].action();
            }
        }
    }
    
    display() {
        // Display previous screen
        if (this.previousScreen) {
            this.previousScreen.display();
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
            
            let isFocused = this.focusedButtonIndex === i;
            
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
            // Draw mute button background (visible on hover)
            if (isMuteBtnHovered) {
                fill(180, 126, 89, 150); // Light brown, semi-transparent
                noStroke();
                ellipse(muteBtnX, muteBtnY, this.volumeIconSize + 10);
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
        if (isHovered || isDragging) {
            fill(160, 82, 45); // Light brown
        } else {
            fill(139, 69, 19); // Dark brown
        }
        ellipseMode(CENTER);
        ellipse(sliderX, y, this.sliderHandleSize);
        
        // Draw volume value text (moved to right of progress bar)
        fill(0, 0, 0);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(`${Math.round(value * 100)}%`, x + this.sliderWidth/2 + 15, y);
    }
    
    mousePressed() {
        // Check if mute button was clicked
        const musicMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const musicMuteBtnY = this.boxY + this.boxHeight/3;
        const soundMuteBtnX = baseWidth/2 - this.sliderWidth/2 - this.volumeIconSize - 15;
        const soundMuteBtnY = this.boxY + this.boxHeight/2 + 50; // Fix sound mute button Y coordinate
        
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
        
        // Check if music slider was clicked
        if (this.isMouseOverSlider(this.musicSliderX, this.musicSliderY)) {
            this.isDraggingMusic = true;
            this.updateMusicVolume();
            return;
        }
        
        // Check if sound slider was clicked
        if (this.isMouseOverSlider(this.soundSliderX, this.soundSliderY)) {
            this.isDraggingSound = true;
            this.updateSoundVolume();
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