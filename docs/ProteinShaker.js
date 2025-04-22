class ProteinShaker extends SpecialItem {
    static activeEffects = 0;  // Static counter for active effects

    constructor(x, y) {
        super(x, y, 50, 50, 3);
        this.boostDuration = 10000;  // 10 seconds duration
        this.isBoosted = false;
        this.startTime = 0;
    }

    loadImage() {
        this.image = loadImage('assets/protein-shaker.webp');
    }

    createBurstEffect(x, y, game, player) {
        // Create burst particles
        for (let i = 0; i < 20; i++) {
            const particle = new Particle(x, y, 'strength_burst');
            const angle = random(TWO_PI);
            const speed = random(3, 6);

            particle.speedX = cos(angle) * speed;
            particle.speedY = sin(angle) * speed;
            game.particles.push(particle);
        }

        // Create strength boost text
        const textParticle = new Particle(x, y - 30, 'strength_boost');
        game.particles.push(textParticle);

        // Create additional text showing the new stack limit
        const limitText = new Particle(x, y - 60, 'stack_limit');
        limitText.text = `Unlimited Maximum Stack`;
        game.particles.push(limitText);
    }

    applyEffect(player, game) {
        // Create initial burst effect
        this.createBurstEffect(
            player.x + player.w / 2,
            player.y + player.h / 4 - player.stack.length * 40, // Adjusted to account for stack height
            game,
            player
        );

        // Apply stack size boost and remove speed reduction
        player.maxStack = 10;
        player.speedReductionPerGrass = 0;  // No speed reduction during boost
        this.isBoosted = true;
        this.startTime = millis(); // 记录开始时间
        player.proteinShaker = this; // 设置对玩家的引用
        ProteinShaker.activeEffects++;  // Increment active effects counter

        // Create strength trail particles
        const interval = setInterval(() => {
            if (this.isBoosted) {
                // Create particles at player's position
                const x = player.x + player.w / 2;
                const y = player.y + player.h / 4 * 3;

                // Create more particles when moving
                const particleCount = player.dir !== 0 ? 5 : 2;

                for (let i = 0; i < particleCount; i++) {
                    const particle = new Particle(x, y, 'strength_trail');

                    // Adjust particle properties based on movement direction
                    if (player.dir !== 0) {
                        // When moving, create a trail effect
                        particle.speedX = player.dir * random(2, 4); // Move in direction of travel
                        particle.speedY = random(-1, 1); // Slight vertical spread
                        particle.size = random(10, 20); // Larger particles when moving
                        particle.life = 20; // Shorter life for trail effect
                    }

                    // Red-white color gradient based on movement
                    const speedFactor = abs(player.dir);
                    particle.color = color(
                        255,  // More red
                        200 - speedFactor * 50,  // Less white when moving faster
                        200 - speedFactor * 50
                    );

                    game.particles.push(particle);
                }
            }
        }, 50); // Faster particle spawn rate

        // Reset values and stop particles after duration
        setTimeout(() => {
            this.isBoosted = false;
            player.proteinShaker = null; // 清除引用
            ProteinShaker.activeEffects--;  // Decrement active effects counter

            // Only reset values if this was the last active effect
            if (ProteinShaker.activeEffects === 0) {
                player.maxStack = 5;
                player.speedReductionPerGrass = 0.1;
            }

            clearInterval(interval);
        }, this.boostDuration);
    }

    getRemainingTime() {
        if (!this.isBoosted) return 0;
        const elapsed = millis() - this.startTime;
        return max(0, (this.boostDuration - elapsed) / 1000); // 转换为秒
    }
} 