class Particle {
    constructor(x, y, type = 'sparkle') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 60;
        this.alpha = 255;
        this.speedX = 0;
        this.speedY = 0;
        this.size = 5;
        this.color = color(255, 255, 255);
        this.text = '';
        this.rotation = 0;
        this.rotationSpeed = 0;

        // Configure particle based on type
        this.configureByType();
    }

    configureByType() {
        switch (this.type) {
            case 'sparkle':
                this.size = random(3, 8);
                this.speedX = random(-2, 2);
                this.speedY = random(-2, 2);
                this.color = color(255, 255, 255, 200);
                break;

            case 'perfect_stack':
                this.text = "Perfect Stack!";
                this.size = 24;
                this.speedY = -1;
                this.life = 60;
                this.color = color(255, 215, 0);
                break;

            case 'bonus_time':
                this.text = "+2s";
                this.size = 20;
                this.speedY = -1;
                this.life = 45;
                this.color = color(0, 255, 0);
                break;

            case 'speed_boost':
                this.text = "Speed Boost!";
                this.size = 24;
                this.speedY = -1;
                this.life = 60;
                this.color = color(242, 70, 211);
                break;

            case 'speed_trail':
                this.size = random(3, 6);
                this.speedX = random(-1, 1);
                this.speedY = random(-1, 1);
                this.life = 30;
                this.color = color(0, 200, 255, 150);
                break;

            case 'strength_burst':
                this.size = random(8, 15);
                this.speedX = random(-3, 3);
                this.speedY = random(-3, 3);
                this.life = 30;
                this.color = color(255, 0, 0, 200);
                break;

            case 'strength_boost':
                this.text = "Strength Boost!";
                this.size = 24;
                this.speedY = -1;
                this.life = 120;
                this.color = color(255, 0, 0);
                break;

            case 'stack_limit':
                this.size = 20;
                this.speedY = -1;
                this.life = 120;
                this.color = color(255, 255, 255);
                break;

            case 'strength_trail':
                this.size = random(3, 6);
                this.speedX = random(-1, 1);
                this.speedY = random(-1, 1);
                this.life = 30;
                this.color = color(255, 200, 200, 150);
                break;

            default:
                // Default sparkle configuration
                this.size = random(3, 8);
                this.speedX = random(-2, 2);
                this.speedY = random(-2, 2);
                this.color = color(255, 255, 255, 200);
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.alpha = map(this.life, 0, 60, 0, 255);
        this.rotation += this.rotationSpeed;
    }

    draw() {
        push();
        if (this.text) {
            textSize(this.size);
            fill(red(this.color), green(this.color), blue(this.color), this.alpha);
            textAlign(CENTER, CENTER);
            text(this.text, this.x, this.y);
        } else {
            fill(red(this.color), green(this.color), blue(this.color), this.alpha);
            noStroke();
            ellipse(this.x, this.y, this.size);
        }
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
} 