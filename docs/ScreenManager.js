// 确保 ScreenManager 类被正确导出
window.ScreenManager = class ScreenManager {
    constructor() {
        console.log('Initializing ScreenManager');
        this.homeScreen = new HomeScreen(this);      
        this.menuScreen = new MenuScreen(this);
        this.pauseScreen = new PauseScreen(this);
        
        this.stepByStepHelpScreen = new StepByStepHelpScreen(this);
        this.singleHelpScreen = new SingleHelpScreen(this);
        this.coopHelpScreen = new CoopHelpScreen(this);
        this.pvpHelpScreen = new PvpHelpScreen(this);

        // 初始化音效管理器
        this.soundManager = new SoundManager(this);

        // 在 soundManager 初始化后创建 settingScreen
        this.settingScreen = new SettingScreen(this);

        this.single = new Single(this);
        this.pvp = new Pvp(this);
        this.coop = new Coop(this);

        this.currentScreen = this.homeScreen; //home screen is the default current
        this.isChangingScreen = false; // 添加标志来防止屏幕切换时的重叠
        
        // 添加页面加载完成后的背景音乐播放
        window.addEventListener('load', () => {
            console.log('Page loaded, playing background music');
            this.soundManager.playBackgroundMusic();
        });
    }

    changeScreen(screen) {
        if (this.isChangingScreen) return; // 如果正在切换屏幕，直接返回
        this.isChangingScreen = true;
        
        // 切换屏幕
        const previousScreen = this.currentScreen;
        this.currentScreen = screen;
        
        console.log('Previous screen:', previousScreen.constructor.name);
        console.log('Current screen:', screen.constructor.name);
        
        // 根据屏幕类型播放相应的音效和背景音乐
        if (screen instanceof GameScreen) {
            // 检查previousScreen是否是PauseScreen的实例
            if (!(previousScreen instanceof PauseScreen)) {
                console.log('Not from pause screen, restarting music');
                this.soundManager.stopBackgroundMusic();
                this.soundManager.playBackgroundMusic();
            } else {
                //console.log('From pause screen, keeping music state');
            }
        } else if (screen === this.menuScreen) {
            if (previousScreen !== this.stepByStepHelpScreen && previousScreen !== this.singleHelpScreen 
                && previousScreen !== this.coopHelpScreen && previousScreen !== this.pvpHelpScreen 
                && previousScreen !== this.settingScreen) {
                this.soundManager.stopBackgroundMusic();
                this.soundManager.playBackgroundMusic();
            }
        } else if (screen === this.homeScreen) {
            // 从menuScreen回到homeScreen时停止音乐
            if (previousScreen === this.menuScreen) {
                this.soundManager.stopBackgroundMusic();
            }
        } else if (screen instanceof GameOverScreen) {
            this.soundManager.playSound('gameOver');
        } else if (screen instanceof LevelSuccessScreen) {
            this.soundManager.playSound('levelSuccess');
        } else if (screen instanceof AccomplishScreen) {
            this.soundManager.stopBackgroundMusic();
            this.soundManager.playBackgroundMusic();
        }
        
        // 在下一帧重置标志
        requestAnimationFrame(() => {
            this.isChangingScreen = false;
        });
    }

    display() {
        this.currentScreen.display();
    }

    mousePressed() {
        if (this.currentScreen) {
            this.currentScreen.mousePressed();
        }
    }

    mouseReleased() {
        if (this.currentScreen) {
            this.currentScreen.mouseReleased();
        }
    }

    mouseDragged() {
        if (this.currentScreen) {
            this.currentScreen.mouseDragged();
        }
    }

    doubleClick() {
        if (this.currentScreen) {
            this.currentScreen.doubleClicked();
        }
    }

    keyPressed() {
        this.currentScreen.keyPressed(); 
    }

    keyReleased() {
        this.currentScreen.keyReleased(); 
    }

    // Handle visibility change (tab switching)
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden (user switched tabs)
            if (this.currentScreen === this.single && this.single.levelTimerInterval !== null) {
                this.changeScreen(this.single.pauseScreen);
            } else if (this.currentScreen === this.pvp && this.pvp.levelTimerInterval !== null) {
                this.changeScreen(this.pvp.pauseScreen);
            } else if (this.currentScreen === this.coop && this.coop.levelTimerInterval !== null) {
                this.changeScreen(this.coop.pauseScreen);
            }
        }
    }
}
