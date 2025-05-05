class Shovel extends FallingObject {
    constructor(x, y) {
        super(x, y, 50, 50, 3.5);
    }

    loadImage() {
        this.image = loadImage('assets/shovel.webp');
    }

    hits(player) {
        const overlapThreshold = 0.2; // 20% overlap required

        function calculateXOverlapPercentage(rect1, rect2) {
            const xOverlap = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
                Math.max(rect1.x, rect2.x);

            if (xOverlap <= 0) return 0;
            return xOverlap / rect1.width;
        }

        const isYOverlappingPlayer =
            this.y < player.y + player.h &&
            this.y + this.h > player.y &&
            this.y < player.y + player.h * 0.25;

        if (isYOverlappingPlayer) {
            const xOverlapPercent = calculateXOverlapPercentage(
                { x: this.x, width: this.w },
                { x: player.x, width: player.w }
            );
            if (xOverlapPercent > overlapThreshold) return true;
        }

        for (let i = 0; i < player.stack.length; i++) {
            const hay = player.stack[i];
            const isYOverlappingHay =
                this.y < hay.y + hay.h &&
                this.y + this.h > hay.y;

            if (isYOverlappingHay) {
                const xOverlapPercent = calculateXOverlapPercentage(
                    { x: this.x, width: this.w },
                    { x: hay.x, width: hay.w }
                );
                if (xOverlapPercent > overlapThreshold) return true;
            }
        }

        return false;
    }

    applyEffect(player, game) {
        if (player.soundManager) {
            player.soundManager.playSound('ouch');
        }
        // When shovel hits, clear the stack
        player.stack = [];
        player.flash.setFlashDuration(30); // trigger flash immediately
        game.particles = []; // Clear particles array
    }
} 