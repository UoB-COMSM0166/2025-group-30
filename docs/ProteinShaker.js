class ProteinShaker extends SpecialItem {
    constructor(x, y) {
        super(x, y, 50, 50, 4);
    }

    loadImage() {
        this.image = loadImage('assets/protein_shaker.webp');
    }

    applyEffect(player) {
        // When protein shaker hits, it could:
        // 1. Make the player move faster temporarily
        // 2. Make the player jump higher temporarily
        // 3. Make the player's stack more stable temporarily
        // You can implement any of these effects here
        player.speed *= 1.5; // Example: increase player speed by 50%
        setTimeout(() => {
            player.speed /= 1.5; // Reset speed after effect duration
        }, 5000); // Effect lasts for 5 seconds
    }
} 