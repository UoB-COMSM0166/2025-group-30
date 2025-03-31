class Level {
    static GAME_MODES = {
        SINGLE: 'single',
        COOP: 'coop',
        PVP: 'pvp'
    };

    static DEFAULT_SETTINGS = {
        [Level.GAME_MODES.SINGLE]: {
            initialTargetScores: 5,
            targetScoresIncrement: 20,

            initialTimer: 20,
            timerIncrement: 30,

            initialGrassDropDelay: 2000,
            grassDropDelayDecrement: 500,
            minGrassDropDelay: 500,

            initialShovelDropDelay: 3500, //not used in level 1
            shovelDropDelayDecrement: 500,
            minShovelDropDelay: 2000
        },
        [Level.GAME_MODES.COOP]: {
            initialTargetScores: 5,
            targetScoresIncrement: 5,

            initialTimer: 15,
            timerIncrement: 15,

            initialGrassDropDelay: 1500,
            grassDropDelayDecrement: 200,
            minGrassDropDelay: 500,

            initialShovelDropDelay: 3500,
            shovelDropDelayDecrement: 300,
            minShovelDropDelay: 2500
        },
        [Level.GAME_MODES.PVP]: {
            initialTargetScores: 0, // Not used in PvP
            targetScoresIncrement: 0, // Not used in PvP

            initialTimer: 30,
            timerIncrement: 30,

            initialGrassDropDelay: 1500,
            grassDropDelayDecrement: 300,
            minGrassDropDelay: 500,

            initialShovelDropDelay: 3500,
            shovelDropDelayDecrement: 500,
            minShovelDropDelay: 2000
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
        this.grassDropDelay = max(
            this.settings.minGrassDropDelay,
            this.grassDropDelay - this.settings.grassDropDelayDecrement
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
        this.grassDropDelay = settings.initialGrassDropDelay;
        this.shovelDropDelay = settings.initialShovelDropDelay;
        this.resetTimeLeft();
    }
} 