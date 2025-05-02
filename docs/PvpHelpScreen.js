class PvpHelpScreen extends DoubleHelpScreen {
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
                    this.screenManager.pvp.restartFromLevel1();
                    this.screenManager.changeScreen(this.screenManager.pvp);
                }
            }
        ];
    }
}