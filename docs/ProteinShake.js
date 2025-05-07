class ProteinShake extends SpecialItem {

    constructor(x, y) {
        super(x, y, 50, 50, 2.8);
        this.boostDuration = 10000;  // 10 seconds duration
        this.timeLeft = this.boostDuration / 1000;
        this.interval = null;
    }

    loadImage() {
        this.image = loadImage('assets/protein-shaker.webp');
    }

    createBurstEffect(x, y, game) {
        let particles = game.particles;
        if (game.particles1 && game.particles2) {
            // PVP or Coop mode
            particles = game.player1 && game.player1.proteinShake === this ? game.particles1 : game.particles2;
        }

        // Create burst particles
        for (let i = 0; i < 20; i++) {
            const particle = new Particle(x, y, 'strength_burst');
            const angle = random(TWO_PI);
            const speed = random(3, 6);

            particle.speedX = cos(angle) * speed;
            particle.speedY = sin(angle) * speed;
            particles.push(particle);
        }

        // Create strength boost text
        const textParticle = new Particle(x, y - 30, 'strength_boost');
        particles.push(textParticle);

        // Create additional text showing the new stack limit
        const limitText = new Particle(x, y - 60, 'stack_limit');
        limitText.text = `Unlimited Maximum Stack`;
        particles.push(limitText);
    }

    applyEffect(player, game) {
        if (player.soundManager) {
            player.soundManager.playSound('specialItem');
        }
        // Create initial burst effect
        this.createBurstEffect(
            player.x + player.w / 2,
            player.y + player.h / 4 - player.stack.length * 40, // Adjusted to account for stack height
            game,
            player
        );
        this.timeLeft = this.boostDuration / 1000;

        // Apply stack size boost and remove speed reduction
        player.maxStack = 10;
        player.speedReductionPerHay = 0;  // No speed reduction during boost
        player.proteinShake = this;

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        // Create strength trail particles
        this.interval = setInterval(() => {
            // Check if player still has this effect (to prevent dangling interval)
            if (player.proteinShake !== this) {
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

                    // Get the correct particles array
                    let particles = game.particles;
                    if (game.particles1 && game.particles2) {
                        particles = game.player1 === player ? game.particles1 : game.particles2;
                    }

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

                        particles.push(particle);
                    }
                }
            } else {
                player.maxStack = 5;
                player.speedReductionPerHay = 0.1;
                player.proteinShake = null;
                clearInterval(this.interval);
            }
        }, 50); // Faster particle spawn rate
    }
} 