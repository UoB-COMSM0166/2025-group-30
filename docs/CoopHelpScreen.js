class CoopHelpScreen extends DoubleHelpScreen {
    constructor(screenManager) {
        super(screenManager);

        this.buttons = [
            {
                label: "Back",
                x: baseWidth / 6,
                y: baseHeight / 8 * 7,
                buttonWidth: this.menuButtonWidth,
                buttonHeight: this.menuButtonHeight,
                action: () => this.screenManager.changeScreen(this.screenManager.menuScreen)
            },
            {
                label: "Start",
                x: baseWidth / 6 * 5,
                y: baseHeight / 8 * 7,
                buttonWidth: this.menuButtonWidth,
                buttonHeight: this.menuButtonHeight,
                action: () => {
                    this.screenManager.coop.restartFromLevel1(); //reset coop to level 1
                    this.screenManager.changeScreen(this.screenManager.coop.targetScoreScreen);
                }
            }
        ];

    }
}