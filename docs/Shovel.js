class Shovel extends SpecialItem {
    constructor(x, y) {
        super(x, y, 50, 50, 3);
    }

    loadImage() {
        this.image = loadImage('assets/shovel.webp');
    }

    applyEffect(player, game) {
        // When shovel hits, clear the stack
        player.stack = [];
        player.flash.setFlashDuration(30); // trigger flash immediately
        game.particles = []; // Clear particles array
    }
} 