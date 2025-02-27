class CollisionHandler {
    checkCollisions(gameManager) {
        const grasses = gameManager.grasses;
        
        // 检查草和地面的碰撞
        for (let i = grasses.length - 1; i >= 0; i--) {
            const grass = grasses[i];
            if (grass.y > height) {
                grasses.splice(i, 1);
                gameManager.state.lives--;
                
                if (gameManager.state.lives <= 0) {
                    gameManager.state.gameOver = true;
                }
                continue;
            }

            // 检查草和玩家的碰撞
            this.checkPlayerCollision(grass, gameManager.player1);
            if (gameManager.state.isTwoPlayerMode) {
                this.checkPlayerCollision(grass, gameManager.player2);
            }
        }
    }

    checkPlayerCollision(grass, player) {
        if (grass.x + grass.size2 >= player.x &&
            grass.x <= player.x + player.w &&
            grass.y + grass.size1 >= player.y &&
            grass.y <= player.y + player.h) {
            // 从草的数组中移除这块草
            const index = player.gameManager.grasses.indexOf(grass);
            if (index > -1) {
                player.gameManager.grasses.splice(index, 1);
                player.catchGrass(grass);
            }
        }
    }
} 