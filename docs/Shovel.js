class Shovel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.speed = 3;
        this.image = null;
        this.loadImage();
    }

    loadImage() {
        this.image = loadImage('assets/shovel.webp');
    }

    fall() {
        this.y += this.speed;
    }

    draw() {
        image(this.image, this.x, this.y, this.w, this.h);
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

    isOffscreen() {
        return this.y > height;
    }
} 