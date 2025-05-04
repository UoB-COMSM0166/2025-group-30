class SoundManager {
    constructor(screenManager) {
        // Save screenManager reference
        this.screenManager = screenManager;
        
        // Background music
        this.bgMusic = null;
        this.bgMusicVolume = 0.5;
        
        // Sound effects
        this.sounds = {
            buttonClick: null,    // Button click sound
            setHay: null,         // Place hay sound
            collectHay: null,     // Collect hay sound
            specialItem: null,    // special items
            gameMusic: null,      // Game background music
            homeMusic: null,      // Main menu background music
            gameOver: null,       // Game over sound
            levelSuccess: null,   // Level success sound
            accomplishMusic: null,     // Level completion sound
            ouch: null            // Ouch sound
        };
        
        this.soundVolume = 1;
        this.soundsLoaded = false;
        this.isBackgroundMusicPlaying = false;
        this.currentBackgroundMusic = null;

        this.checkAudioContext();

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
        this.loadSounds();
    }
    
    loadSounds() {
        try {
            // load sounds
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
            // set sound volume
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

        // Stop current playing music first
        this.stopBackgroundMusic();

        if (this.screenManager.currentScreen instanceof GameScreen) {
            this.currentBackgroundMusic = this.sounds.gameMusic;
        } else if (this.screenManager.currentScreen instanceof AccomplishScreen 
            || this.screenManager.currentScreen instanceof PvpAccomplishScreen) {
            this.currentBackgroundMusic = this.sounds.accomplishMusic;
        } else if (this.screenManager.currentScreen === this.screenManager.menuScreen) {
            // Only play main menu music on menu screen
            this.currentBackgroundMusic = this.sounds.homeMusic;
        } else if (this.screenManager.currentScreen instanceof PauseScreen) {
            // Don't play music during pause
            this.currentBackgroundMusic = null;
        } else {
            // Don't play background music on other screens
            this.currentBackgroundMusic = null;
        }

        this.updateBackgroundMusicVolume();

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
        // Set main menu music volume
        if (this.sounds.homeMusic) {
            const homeVolume = 0.8 * this.bgMusicVolume;
            this.sounds.homeMusic.setVolume(homeVolume);
        }
        
        // Set game music volume
        if (this.sounds.gameMusic) {
            const gameVolume = 0.5 * this.bgMusicVolume;
            this.sounds.gameMusic.setVolume(gameVolume);
        }

        // Set accomplish music volume
        if (this.sounds.accomplishMusic) {
            const accomplishVolume = 0.8 * this.bgMusicVolume;
            this.sounds.accomplishMusic.setVolume(accomplishVolume);
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = volume;
        for (let sound in this.sounds) {
            if (this.sounds[sound] && sound !== 'homeMusic' && sound !== 'gameMusic' && sound !== 'accomplishMusic') {
                this.sounds[sound].setVolume(volume);
            }
        }
    }
} 