function keyPressed() {
    //if (gameOver && keyCode === ENTER) restartGame();
    if (domain === "single") {
        if (keyCode === RIGHT_ARROW) single.player.dir = 1;
        else if (keyCode === LEFT_ARROW) single.player.dir = -1;
        else if (keyCode === 32) single.player.dropGrass(); //spacebar
    }
}

function keyReleased() {
    if (domain === "single"){
        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) single.player.dir = 0;
    }
}