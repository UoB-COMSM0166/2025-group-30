class Basket {
    constructor(position = "left") { //ifLeft is only applicable to pvp mode
        this.position = position;

        if (this.position === "left") this.x = 10;
        else if (this.position === "right") this.x = baseWidth - 60;
        this.y = baseHeight- 100;

        this.w = 50;
        this.h = 100;
    }

    draw() {
        rectMode(CORNER);
        fill(165, 42, 42);
        rect(this.x, this.y, this.w, this.h);
    }
}
