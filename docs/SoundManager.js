class SoundManager {
    constructor(screenManager) {
        // 保存screenManager引用
        this.screenManager = screenManager;
        
        // 背景音乐
        this.bgMusic = null;
        this.bgMusicVolume = 0.5;
        
        // 音效
        this.sounds = {
            buttonClick: null,    // 按钮点击音效
            setHay: null,         // 放置干草音效
            collectHay: null,     // 收集干草音效
            specialItem: null,    // special items
            gameMusic: null,      // 游戏背景音乐
            homeMusic: null,      // 主界面背景音乐
            gameOver: null,       // 游戏结束音效
            levelSuccess: null,   // 关卡成功音效
            accomplishMusic: null,     // 通关音效
            ouch: null            // ouch 音效
        };
        
        this.soundVolume = 1;
        this.soundsLoaded = false;
        this.isBackgroundMusicPlaying = false;
        this.currentBackgroundMusic = null;

        // 检查音频上下文状态
        this.checkAudioContext();
        
        // 加载所有音效
        this.loadSounds();
    }
    
    checkAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const audioContext = new AudioContext();
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                    }).catch(error => {
                    });
                }
            }
        } catch (error) {
        }
    }
    
    preload() {
        // 为了兼容性保留这个方法，但实际加载在 loadSounds 中进行
        this.loadSounds();
    }
    
    loadSounds() {
        try {
            // 加载音效
            this.sounds.buttonClick = loadSound('assets/sound/click.mp3', () => {
            });
            this.sounds.setHay = loadSound('assets/sound/sethay.wav', () => {
            });
            this.sounds.collectHay = loadSound('assets/sound/collecthay.wav', () => {
            });
            this.sounds.specialItem = loadSound('assets/sound/bling.mp3', () => {
            });
            this.sounds.ouch = loadSound('assets/sound/failtogethay.wav', () => {
            });
            this.sounds.gameMusic = loadSound('assets/sound/bgm.wav', () => {
            });
            this.sounds.homeMusic = loadSound('assets/sound/homescreen.m4a', () => {
            });
            this.sounds.gameOver = loadSound('assets/sound/gameover.mp3', () => {
            });
            this.sounds.levelSuccess = loadSound('assets/sound/levelup.mp3', () => {
            });
            this.sounds.accomplishMusic = loadSound('assets/sound/accomplish.mp3', () => {
            });
            // 设置音效音量
            for (let sound in this.sounds) {
                if (this.sounds[sound]) {
                    this.sounds[sound].setVolume(this.soundVolume);
                }
            }
            this.soundsLoaded = true;
        } catch (error) {
            this.soundsLoaded = false;
        }
    }
    
    playBackgroundMusic() {
        if (!this.soundsLoaded) {
            return;
        }

        // 先停止当前正在播放的音乐
        this.stopBackgroundMusic();

        if (this.screenManager.currentScreen === this.screenManager.homeScreen) {
            this.currentBackgroundMusic = this.sounds.homeMusic;
        } else if (this.screenManager.currentScreen instanceof GameScreen) {
            this.currentBackgroundMusic = this.sounds.gameMusic;
        } else if (this.screenManager.currentScreen instanceof AccomplishScreen) {
            this.currentBackgroundMusic = this.sounds.accomplishMusic;
        } else {
            // 对于其他屏幕，默认使用主菜单音乐
            this.currentBackgroundMusic = this.sounds.homeMusic;
        }

        // 确保音量设置正确
        this.updateBackgroundMusicVolume();

        // 播放选定的音乐
        if (this.currentBackgroundMusic) {
            try {
                this.currentBackgroundMusic.loop();
                this.isBackgroundMusicPlaying = true;
            } catch (error) {
            }
        }
    }
    
    stopBackgroundMusic() {
        if (!this.soundsLoaded) return;

        if (this.currentBackgroundMusic) {
            this.currentBackgroundMusic.stop();
            this.isBackgroundMusicPlaying = false;
        }
    }
    
    isBackgroundMusicPlaying() {
        return this.isBackgroundMusicPlaying;
    }
    
    playSound(soundName) {
        if (!this.soundsLoaded) {
            return;
        }

        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName].play();
            } catch (error) {
            }
        }
    }
    
    setBackgroundMusicVolume(volume) {
        this.bgMusicVolume = volume;
        this.updateBackgroundMusicVolume();
    }
    
    updateBackgroundMusicVolume() {
        // 设置主菜单音乐音量
        if (this.sounds.homeMusic) {
            const homeVolume = 0.8 * this.bgMusicVolume;
            this.sounds.homeMusic.setVolume(homeVolume);
        }
        
        // 设置游戏音乐音量
        if (this.sounds.gameMusic) {
            const gameVolume = 0.5 * this.bgMusicVolume;
            this.sounds.gameMusic.setVolume(gameVolume);
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = volume;
        for (let sound in this.sounds) {
            if (this.sounds[sound] && sound !== 'homeMusic' && sound !== 'gameMusic') {
                this.sounds[sound].setVolume(volume);
            }
        }
    }
} 