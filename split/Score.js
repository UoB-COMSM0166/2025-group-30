class Score {
    draw(state) {
        textSize(20);
        fill(255);
        if (state.isTwoPlayerMode) {
            text(`P1 Score: ${state.score1}`, 10, 30);
            text(`P2 Score: ${state.score2}`, width - 150, 30);
        } else {
            text(`Score: ${state.score1}`, 10, 30);
        }
    }
} 