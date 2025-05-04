class Level {
    static GAME_MODES = {
        SINGLE: 'single',
        COOP: 'coop',
        PVP: 'pvp'
    };

    static DEFAULT_SETTINGS = {
        [Level.GAME_MODES.SINGLE]: {
            initialTargetScores: 5,
            targetScoresIncrement: 5,

            initialTimer: 15,
            timerIncrement: 2,

            initialHayDropDelay: 1500, //2 seconds
            hayDropDelayDecrement: 250,
            minHayDropDelay: 700,

            initialSpecialItemDropDelay: 8000, //8 seconds
            specialItemDropDelayDecrement: 500, //decrease by 0.5 seconds each level
            minSpecialItemDropDelay: 5000, //minimum 5 seconds

            initialShovelDropDelay: 6000, //6 seconds
            shovelDropDelayDecrement: 400, //decrease by 0.4 seconds each level
            minShovelDropDelay: 3000, //minimum 3 seconds
        },
        [Level.GAME_MODES.COOP]: {
            initialTargetScores: 5,
            targetScoresIncrement: 8,

            initialTimer: 16,
            timerIncrement: 2,

            initialHayDropDelay: 1000,
            hayDropDelayDecrement: 200,
            minHayDropDelay: 500,

            initialSpecialItemDropDelay: 4000,
            specialItemDropDelayDecrement: 300,
            minSpecialItemDropDelay: 3000,

            initialShovelDropDelay: 3000, //4 seconds
            shovelDropDelayDecrement: 300, //decrease by 0.3 seconds each level
            minShovelDropDelay: 2000, //minimum 2 seconds
        },
        [Level.GAME_MODES.PVP]: {
            initialTargetScores: 0, // Not used in PvP
            targetScoresIncrement: 0, // Not used in PvP

            initialTimer: 15,
            timerIncrement: 5,

            initialHayDropDelay: 1500,
            hayDropDelayDecrement: 300,
            minHayDropDelay: 500,

            initialSpecialItemDropDelay: 8000,
            specialItemDropDelayDecrement: 500,
            minSpecialItemDropDelay: 6000,

            initialShovelDropDelay: 3000, //3 seconds
            shovelDropDelayDecrement: 200, //decrease by 0.4 seconds each level
            minShovelDropDelay: 1500, //minimum 1.5 seconds
        }
    };

    constructor(gameMode, level = 1) {
        this.gameMode = gameMode;
        const settings = Level.DEFAULT_SETTINGS[gameMode];

        this.level = level;
        this.targetScores = settings.initialTargetScores;
        this.timer = settings.initialTimer;
        this.timeLeft = this.timer;
        this.hayDropDelay = settings.initialHayDropDelay;
        this.specialItemDropDelay = settings.initialSpecialItemDropDelay;
        this.shovelDropDelay = settings.initialShovelDropDelay;
        
        // Store settings for level progression
        this.settings = settings;
    }

    resetTimeLeft() {
        this.timeLeft = this.timer;
    }

    startNextLevel() {
        this.level++;
        this.targetScores += this.settings.targetScoresIncrement;
        this.timer += this.settings.timerIncrement;
        this.hayDropDelay = max(
            this.settings.minHayDropDelay,
            this.hayDropDelay - this.settings.hayDropDelayDecrement
        );
        this.specialItemDropDelay = max(
            this.settings.minSpecialItemDropDelay,
            this.specialItemDropDelay - this.settings.specialItemDropDelayDecrement
        );
        this.shovelDropDelay = max(
            this.settings.minShovelDropDelay,
            this.shovelDropDelay - this.settings.shovelDropDelayDecrement
        );
        
        this.resetTimeLeft();
    }

    resetToLevel1() {
        const settings = this.settings;
        this.level = 1;
        this.targetScores = settings.initialTargetScores;
        this.timer = settings.initialTimer;
        this.hayDropDelay = settings.initialHayDropDelay;
        this.specialItemDropDelay = settings.initialSpecialItemDropDelay;
        this.shovelDropDelay = settings.initialShovelDropDelay;
        
        this.resetTimeLeft();
    }

    addTime(seconds) {
        this.timeLeft += seconds;
    }
} 