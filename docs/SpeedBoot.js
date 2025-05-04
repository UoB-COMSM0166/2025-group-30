class SpeedBoot extends SpecialItem {

    constructor(x, y) {
        super(x, y, 50, 50, 2.8);
        this.speedBoostMultiplier = 1.2;  // 20% speed increase
        this.maxBoostSpeed = 15;  // Maximum speed limit during boost
        this.boostDuration = 5000;  // 5 seconds duration
        this.timeLeft = this.boostDuration / 1000;
        this.interval = null;
    }

    loadImage() {
        this.image = loadImage('assets/speed-boot.webp');
    }

    createBurstEffect(x, y, game) {
        if (!game.particles) {
            game.particles = [];
        }

        // Create burst particles
        for (let i = 0; i < 20; i++) {
            const particle = new Particle(x, y, 'speed_burst');
            const angle = random(TWO_PI);
            const speed = random(3, 6);

            particle.speedX = cos(angle) * speed;
            particle.speedY = sin(angle) * speed;
            game.particles.push(particle);
        }

        // Create speed boost text
        const textParticle = new Particle(x, y - 30, 'speed_boost');
        game.particles.push(textParticle);
    }

    applyEffect(player, game) {
        if (player.soundManager) {
            player.soundManager.playSound('specialItem');
        }
        // Create initial burst effect
        this.createBurstEffect(
            player.x + player.w / 2,
            player.y + player.h / 4 - player.stack.length * 40, // Adjusted to account for stack height
            game
        );
        this.timeLeft = this.boostDuration / 1000;

        // Store original values
        const originalVelocity = player.velocity;
        const originalMaxSpeed = player.maxSpeed;

        // Apply speed boost with limit
        player.velocity *= this.speedBoostMultiplier;
        player.maxSpeed = min(player.maxSpeed * this.speedBoostMultiplier, this.maxBoostSpeed);
        player.speedBoot = this; // 设置对玩家的引用

        // Create speed trail particles
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.interval = setInterval(() => {
            // Check if player still has this boot (to prevent dangling interval)
            if (player.speedBoot !== this) {
                return;
            }

            if (this.timeLeft > 0) {
                if (screenManager.currentScreen === game) {

                    this.timeLeft -= 0.05;

                    // Create particles at player's position
                    const x = player.x + player.w / 2;
                    const y = player.y + player.h / 4 * 3;

                    // Create more particles when moving
                    const particleCount = player.dir !== 0 ? 5 : 2;

                    for (let i = 0; i < particleCount; i++) {
                        const particle = new Particle(x, y, 'speed_trail');

                        // Adjust particle properties based on movement direction
                        if (player.dir !== 0) {
                            // When moving, create a trail effect
                            particle.speedX = player.dir * random(2, 4); // Move in direction of travel
                            particle.speedY = random(-1, 1); // Slight vertical spread
                            particle.size = random(10, 20); // Larger particles when moving
                            particle.life = 20; // Shorter life for trail effect
                        }

                        // Blue-white color gradient based on speed
                        const speedFactor = abs(player.dir);
                        particle.color = color(
                            150 + speedFactor * 50,  // More blue when moving faster
                            200 + speedFactor * 30,  // More white when moving faster
                            255
                        );

                        game.particles.push(particle);
                    }
                }
            } else {
                player.velocity = originalVelocity;
                player.maxSpeed = originalMaxSpeed;
                player.speedBoot = null; // 清除引用
                clearInterval(this.interval);
            }
        }, 50); // Faster particle spawn rate
    }
}