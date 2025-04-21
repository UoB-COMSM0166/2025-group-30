class Shovel extends SpecialItem {
    constructor(x, y) {
        super(x, y, 50, 50, 4);
    }

    loadImage() {
        this.image = loadImage('assets/shovel.webp');
    }

    applyEffect(player) {
        // When shovel hits, clear the stack
        player.stack = [];
        player.flash.setFlashDuration(30); // trigger flash immediately
    }
} 