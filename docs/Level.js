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
            //initialTimer: 100,
            timerIncrement: 5,

            initialGrassDropDelay: 2000, //2 seconds
            grassDropDelayDecrement: 300,
            minGrassDropDelay: 1000,

            initialSpecialItemDropDelay: 10000, //10 seconds
            //initialSpecialItemDropDelay: 2000, //5 seconds
            specialItemDropDelayDecrement: 500, //decrease by 0.5 seconds each level
            minSpecialItemDropDelay: 10000, //minimum 10 seconds
        },
        [Level.GAME_MODES.COOP]: {
            initialTargetScores: 5,
            targetScoresIncrement: 5,

            initialTimer: 15,
            timerIncrement: 15,

            initialGrassDropDelay: 1500,
            grassDropDelayDecrement: 200,
            minGrassDropDelay: 500,

            initialSpecialItemDropDelay: 3500,
            specialItemDropDelayDecrement: 300,
            minSpecialItemDropDelay: 2500,
        },
        [Level.GAME_MODES.PVP]: {
            initialTargetScores: 0, // Not used in PvP
            targetScoresIncrement: 0, // Not used in PvP

            initialTimer: 30,
            timerIncrement: 30,

            initialGrassDropDelay: 1500,
            grassDropDelayDecrement: 300,
            minGrassDropDelay: 500,

            initialSpecialItemDropDelay: 3500,
            specialItemDropDelayDecrement: 500,
            minSpecialItemDropDelay: 2000
        }
    };

    constructor(gameMode, level = 1) {
        this.gameMode = gameMode;
        const settings = Level.DEFAULT_SETTINGS[gameMode];

        this.level = level;
        this.targetScores = settings.initialTargetScores;
        this.timer = settings.initialTimer;
        this.timeLeft = this.timer;
        this.grassDropDelay = settings.initialGrassDropDelay;
        this.specialItemDropDelay = settings.initialSpecialItemDropDelay;
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
        this.grassDropDelay = max(
            this.settings.minGrassDropDelay,
            this.grassDropDelay - this.settings.grassDropDelayDecrement
        );
        this.specialItemDropDelay = max(
            this.settings.minSpecialItemDropDelay,
            this.specialItemDropDelay - this.settings.specialItemDropDelayDecrement
        );
        this.resetTimeLeft();
    }

    resetToLevel1() {
        const settings = this.settings;
        this.level = 1;
        this.targetScores = settings.initialTargetScores;
        this.timer = settings.initialTimer;
        this.grassDropDelay = settings.initialGrassDropDelay;
        this.specialItemDropDelay = settings.initialSpecialItemDropDelay;
        this.resetTimeLeft();
    }

    addTime(seconds) {
        this.timeLeft += seconds;
    }
} 