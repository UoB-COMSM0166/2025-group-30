class SpecialItem extends FallingObject {
    constructor(x, y, w, h, speed) {
        super(x, y, w, h, speed);
    }

    hits(player) {
        const overlapThreshold = 0.2; // 20% overlap required

        function calculateXOverlapPercentage(rect1, rect2) {
            // Find x-axis overlap
            const xOverlap = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
                Math.max(rect1.x, rect2.x);

            if (xOverlap <= 0) return 0;

            // Calculate overlap percentage relative to shovel width
            return xOverlap / rect1.width;
        }

        // Check collision with player
        const isYOverlappingPlayer =
            this.y < player.y + player.h &&
            this.y + this.h > player.y &&
            this.y < player.y + player.h * 0.25; //when shovel is past the player's head, it can't hit the player

        if (isYOverlappingPlayer) {
            const xOverlapPercent = calculateXOverlapPercentage(
                { x: this.x, width: this.w },
                { x: player.x, width: player.w }
            );
            if (xOverlapPercent > overlapThreshold) return true;
        }

        // Check collision with each grass in the stack
        for (let i = 0; i < player.stack.length; i++) {
            const grass = player.stack[i];

            const isYOverlappingGrass =
                this.y < grass.y + grass.h &&
                this.y + this.h > grass.y;

            if (isYOverlappingGrass) {
                const xOverlapPercent = calculateXOverlapPercentage(
                    { x: this.x, width: this.w },
                    { x: grass.x, width: grass.w }
                );
                if (xOverlapPercent > overlapThreshold) return true;
            }
        }

        return false;
    }

    // Abstract method to be implemented by subclasses
    // Defines what happens when the hazard hits the player
    applyEffect(player) {
        throw new Error('Method applyEffect() must be implemented by subclass');
    }
} 