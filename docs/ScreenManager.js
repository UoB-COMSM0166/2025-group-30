// ScreenManager class for handling screen transitions and game states
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

        this.soundManager = new SoundManager(this);
        this.settingScreen = new SettingScreen(this);

        this.single = new Single(this);
        this.pvp = new Pvp(this);
        this.coop = new Coop(this);

        this.currentScreen = this.homeScreen;
        this.isChangingScreen = false;

        window.addEventListener('load', () => {
            console.log('Page loaded, playing background music');
            this.soundManager.playBackgroundMusic();
        });
    }

    changeScreen(screen) {
        if (this.isChangingScreen) return;
        this.isChangingScreen = true;

        const previousScreen = this.currentScreen;
        this.currentScreen = screen;

        console.log('Previous screen:', previousScreen.constructor.name);
        console.log('Current screen:', screen.constructor.name);

        if (screen instanceof GameScreen) {
            if (!(previousScreen instanceof PauseScreen)) {
                console.log('Not from pause screen, restarting music');
                this.soundManager.stopBackgroundMusic();
                this.soundManager.playBackgroundMusic();
            }
        } else if (screen === this.menuScreen) {
            if (previousScreen !== this.stepByStepHelpScreen && previousScreen !== this.singleHelpScreen
                && previousScreen !== this.coopHelpScreen && previousScreen !== this.pvpHelpScreen
                && previousScreen !== this.settingScreen) {
                this.soundManager.stopBackgroundMusic();
                this.soundManager.playBackgroundMusic();
            }
            this.pvp.resetScore();
        } else if (screen === this.homeScreen) {
            if (previousScreen === this.menuScreen) {
                this.soundManager.stopBackgroundMusic();
            }
        } else if (screen instanceof GameOverScreen) {
            this.soundManager.playSound('gameOver');
        } else if (screen instanceof LevelSuccessScreen || screen instanceof PvpLevelUpScreen) {
            this.soundManager.playSound('levelSuccess');
        } else if (screen instanceof AccomplishScreen || screen instanceof PvpAccomplishScreen) {
            this.soundManager.stopBackgroundMusic();
            this.soundManager.playBackgroundMusic();
        }

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

    handleVisibilityChange() {
        if (document.hidden) {
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
