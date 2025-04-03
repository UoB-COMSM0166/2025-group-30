class Player {
    constructor(position = "middle") {
        this.position = position; //used only for pvp mode

        this.w = 100;
        this.h = 150;

        if (position === "middle") this.x = (baseWidth - this.w) / 2;
        else if (position === "left" || position === "pvpLeft") this.x = (baseWidth - this.w) / 4;
        else if (position === "right" || position === "pvpRight") this.x = (baseWidth - this.w) / 4 * 3;

        this.y = baseHeight - 150; //stay the same
        this.score = 0;

        this.velocity = 0;
        this.maxSpeed = 10;
        this.acceleration = 0.8;
        this.decelerationFactor = 0.8;
        this.dir = 0;

        this.stack = [];  //visible caught grass
        this.maxStack = 5;

        this.basket = null; // 确保basket被正确初始化

        this.flash = new Flash(0);

        this.player1Image = null;
        this.loadPlayer1Image();
    }

    reset() {
        if (this.position === "middle") this.x = (baseWidth - this.w) / 2;
        else if (this.position === "left" || this.position === "pvpLeft") this.x = (baseWidth - this.w) / 4;
        else if (this.position === "right" || this.position === "pvpRight") this.x = (baseWidth - this.w) / 4 * 3;

        this.score = 0;

        this.velocity = 0;
        this.dir = 0;

        this.stack = [];
        this.flash.setFlashDuration(0);
    }

    movePlayerWithCaughtGrass() {
        if (this.flash.getFlashDuration() > 0) { return; }

        const oldX = this.x;

        if (this.dir !== 0) {
            if (Math.sign(this.dir) !== Math.sign(this.velocity)  //player changes direction
                && abs(this.velocity) > 0.1) {
                this.velocity = this.dir * (this.acceleration + abs(this.velocity) * 0.5);
            } else { //continue moving in the same direction
                this.velocity += this.dir * this.acceleration;
                this.velocity = constrain(this.velocity, -this.maxSpeed, this.maxSpeed);
            }
        } else {
            this.velocity *= this.decelerationFactor;
            if (abs(this.velocity) < 0.1) this.velocity = 0;
        }

        // 限制移动范围
        if (this.position === "pvpLeft") this.x = constrain(this.x, 0, baseWidth / 2 - this.w);
        else if (this.position === "pvpRight") this.x = constrain(this.x, baseWidth / 2, baseWidth - this.w);
        else this.x = constrain(this.x, 0, baseWidth - this.w);

        // 计算x轴移动距离并更新堆叠的草的位置 caught grass moves with the player
        this.x += this.velocity;
        const dx = this.x - oldX;
        for (let grass of this.stack) {
            grass.x += dx;
        }
    }

    drawPlayerWithCaughtGrass() { //draw player with caught grass    
        this.flash.update();
        if (!this.flash.playerIsVisible) return;//player with grass is not shown if flash is running 

        //draw caught grass
        for (let grass of this.stack) {
            grass.draw();
        }

        // draw player image
        image(this.player1Image, this.x, this.y, this.w, this.h);
    }

    catches(grass) { //return true if grass is caught, false otherwise
        const yGap = 3; // Use consistent gap for all grass blocks

        // 如果是第一个方块，检查是否与木板接触
        if (this.stack.length === 0) {
            // Calculate overlap with player platform
            const overlapLeft = Math.max(this.x, grass.x);
            const overlapRight = Math.min(this.x + this.w, grass.x + grass.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * grass.w; // 20% of grass width

            if (grass.y + grass.h >= this.y &&
                grass.y + grass.h <= this.y + yGap + 2 && // if the falling grass is within the gap range
                overlapWidth >= minRequiredOverlap) {

                // Smoothly position the grass
                grass.y = this.y - grass.h + yGap;
                grass.setPerfectStack(false); // the first grass is not a perfect stack
                this.stack.push(grass);

                // Check if adding this grass exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                }
                return true;
            }
        } else {
            // 获取最上面的方块
            const topGrass = this.stack[this.stack.length - 1];

            // Calculate overlap with top grass in stack
            const overlapLeft = Math.max(topGrass.x, grass.x);
            const overlapRight = Math.min(topGrass.x + topGrass.w, grass.x + grass.w);
            const overlapWidth = Math.max(0, overlapRight - overlapLeft);
            const minRequiredOverlap = 0.2 * grass.w; // 20% of grass width

            // if the falling grass is within the gap range of the top grass
            const isVerticalContact = ((grass.y + grass.h) >= topGrass.y) &&
                ((grass.y + grass.h) <= topGrass.y + yGap + 2);

            if (overlapWidth >= minRequiredOverlap && isVerticalContact) {
                // Position the new grass block directly on top of the previous one with the gap
                grass.y = topGrass.y - grass.h + yGap;
                this.checkPerfectStack(); //check if the new grass is a perfect stack
                this.stack.push(grass);

                // Check if adding this grass exceeds the maximum stack size
                if (this.stack.length > this.maxStack) {
                    this.stack = [];
                    this.flash.setFlashDuration(30); // trigger flash immediately
                }
                return true;
            }
        }
        return false;
    }

    checkPerfectStack() {
        if (this.stack.length < 2) return false;

        const minOverlapPercentage = 0.8; // 80% overlap required for "perfect" alignment

        const currentGrass = this.stack[this.stack.length - 1];
        const grassBelow = this.stack[this.stack.length - 2];

        if (currentGrass.perfectStack != null) { //grass is checked
            return false;
        }

        // Calculate overlap
        const overlapLeft = Math.max(currentGrass.x, grassBelow.x);
        const overlapRight = Math.min(currentGrass.x + currentGrass.w, grassBelow.x + grassBelow.w);
        const overlapWidth = Math.max(0, overlapRight - overlapLeft);

        // Calculate overlap percentage relative to grass width
        const overlapPercentage = overlapWidth / currentGrass.w;

        if (overlapPercentage < minOverlapPercentage) {
            currentGrass.setPerfectStack(false);
            return false;
        }

        currentGrass.setPerfectStack(true);
        currentGrass.perfectStack = true;
        return true;
    }

    emptyToBasket() { //empty grass to the basket
        if (this.stack.length === 0) return;

        // 计算玩家与篮子的距离
        let playerCenter = this.x + this.w / 2;
        let basketCenter = this.basket.x + this.basket.w / 2;
        let distance = abs(playerCenter - basketCenter);

        // 设置最大放草距离
        let maxDistance = 150; // 可以根据需要调整这个值

        // 检查玩家是否在合理范围内
        if (distance <= maxDistance) {
            this.score += this.stack.length;
            this.stack = [];
        }
    }

    loadPlayer1Image() {
        this.player1Image = loadImage("assets/player1.webp");
    }
}
