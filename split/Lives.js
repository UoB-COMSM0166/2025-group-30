class Lives {
    draw(state) {
        textSize(20);
        fill(255);
        text(`Lives: ${state.lives}`, width/2 - 30, 30);

        if (state.gameOver) {
            textSize(32);
            textAlign(CENTER);
            fill(255, 0, 0);
            text('Game Over', width/2, height/2);
            text('Press Enter to restart', width/2, height/2 + 40);
        }
    }
} 