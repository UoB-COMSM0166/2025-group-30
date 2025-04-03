class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'sparkle', 'text', or 'bonus'

        if (type === 'sparkle') {
            this.size = random(3, 8);
            this.speedX = random(-2, 2);
            this.speedY = random(-2, 2);
            this.life = 30;
            this.color = color(255, 215, 0); // Gold color
        } else if (type === 'text') {
            this.text = "Perfect Stack!";
            this.size = 24;
            this.speedY = -1;
            this.life = 60;
            this.color = color(255, 215, 0);
        } else if (type === 'bonus') {
            this.text = "+2s";
            this.size = 20;
            this.speedY = -1;
            this.life = 45;
            this.color = color(0, 255, 0);
        }

        this.alpha = 255;
    }

    update() {
        this.life--;
        this.alpha = map(this.life, 0, 60, 0, 255);

        if (this.type === 'sparkle') {
            this.x += this.speedX;
            this.y += this.speedY;
        } else {
            this.y += this.speedY;
        }
    }

    draw() {
        push();
        if (this.type === 'sparkle') {
            noStroke();
            fill(red(this.color), green(this.color), blue(this.color), this.alpha);
            circle(this.x, this.y, this.size);
        } else {
            textAlign(CENTER);
            textSize(this.size);
            fill(red(this.color), green(this.color), blue(this.color), this.alpha);
            text(this.text, this.x, this.y);
        }
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
} 