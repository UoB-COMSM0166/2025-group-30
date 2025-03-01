class UIManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    render() {
        if (!this.gameManager || !this.gameManager.state) {
            console.error("GameManager or GameState is not properly initialized");
            return;
        }

        background(220);
        noStroke();
        fill(0);
        textSize(20);
        textStyle(NORMAL);

        // --- pvp screen ---
        if (this.gameManager.state.isPlayAgainstMode) {
            stroke(0);
            line(width / 2, 0, width / 2, height);
            noStroke();
        }

        // --- not in game screen, game not running --- 
        if (!this.gameManager.state.startGame) { 
            this.displayStartScreen();   // home screen or mode selection screen or two player mode selection screen 
            return;
        }

        // --- level up screen ---
        if (this.gameManager.state.showLevelUpScreen) {
            this.displayLevelUpScreen();
            return;
        }

        // --- game over screen 
        if (this.gameManager.state.gameOver) {
            this.displayGameOverScreen();
            return;
        }

        this.renderGameElements();
        this.renderUI();
    }

    renderUI() { 
        this.displayGameInfo(); // text info during a game
        if (this.gameManager.state.showPauseMenu) {
            this.drawPauseMenu();
        }
    }

    // draw the start button before a game 
    // draw player, basket, grass during a game
    // draw the pause menu if pause the game 
    renderGameElements() {
        // draw player 1 and basket 1
        this.gameManager.player1.show();
        if (this.gameManager.state.isTwoPlayerMode) this.gameManager.player2.show(); // only draw player 2 if in 2 player mode

        this.gameManager.basket1.show();
        this.gameManager.basket2.show();

        if (!this.gameManager.state.gameStarted) { //in the game, but the game has not started
            this.displayLargeStartButton(); // button appear in the game screen before starting 
            return;
        }

        // =====================================
        // the actual game screen during a game
        // =====================================
        for (let grass of this.gameManager.grassPiles) {
            grass.show();
        }

        if (this.gameManager.state.showPauseMenu) {
            this.drawPauseMenu();
        }

        // if (this.gameManager && this.gameManager.player1) {
        //     this.gameManager.player1.show();
        // }
        
        // if (this.gameManager && this.gameManager.basket1) {
        //     this.gameManager.basket1.show();
        // }
       
        // if (this.gameManager.state.isTwoPlayerMode){ // draw player 2 if in 2 player mode
        //     this.gameManager.player2.show();
        //     if (this.gameManager.state.isPlayAgainstMode) { // draw basket2 if in pvp mode 
        //         this.gameManager.basket2.show();
        //     }
        // }

        // if (this.gameManager.grassPiles && Array.isArray(this.gameManager.grassPiles)) {
        //     for (let grass of this.gameManager.grassPiles) {
        //         // if (grass) {
        //         //     grass.show();
        //         // }
        //     }
        // }
        
        // if (this.gameManager.basket1) {
        //     this.gameManager.basket1.show();
        // }
        // if (this.gameManager.state.isPlayAgainstMode && this.gameManager.basket2) {
        //     this.gameManager.basket2.show();
        // }
    }

   


    // ====================
    //  not in game screen 
    // ====================
    displayStartScreen() {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Click Start to Begin", width / 2, height / 2 - 50);
        
        // in home screen 
        if (!this.gameManager.state.showModeSelection) { 
            this.drawStartButtons();
        } 
        // in mode selection screen
        else if (!this.gameManager.state.showTwoPlayerOptions) {
            this.drawModeSelectionButtons();
        } 
        // two player mode selection screen 
        else {
            this.displayTwoPlayerOptions();
        }
    }

    //--- start buttons for home screen
    drawStartButtons() {
        // 首先绘制一个背景矩形来清除之前的内容
        fill(220);  // 使用和背景相同的颜色
        rect(0, 0, width, height);
        
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Click Start to Begin", width / 2, height / 3);
        
        // 只保留Mode和Help按钮
        fill(0, 191, 255);
        rect(width / 2 - 50, height / 2 - 20, 100, 40);
        fill(0);
        textSize(24);
        text("Mode", width / 2, height / 2);
        
        fill(128);
        rect(width / 2 - 50, height / 2 + 40, 100, 40);
        fill(0);
        textSize(24);
        text("Help", width / 2, height / 2 + 60);
        
        if (this.gameManager.state.showHelp) { //??? handle the logic else where???
            this.drawHelpScreen();
        }
    }

    // ================
    // level up screen 
    // ================
    displayLevelUpScreen() {
        background(220);
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Congratulations!", width / 2, height / 2 - 50);
        
        fill(0, 255, 0);
        rect(width / 2 - 100, height / 2, 200, 50);
        fill(255);
        text("Next Level", width / 2, height / 2 + 25);
        
        fill(255, 0, 0);
        rect(width / 2 - 100, height / 2 + 70, 200, 50);
        fill(255);
        text("Home", width / 2, height / 2 + 95);
    }


    //========================
    //  game over screen 
    //=======================
    displayGameOverScreen() {
        background(220);
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2 - 50);
        
        if (this.gameManager.state.isPlayAgainstMode) {
            if (this.gameManager.state.score1 > this.gameManager.state.score2) {
                text("Player 1 Wins!", width / 2, height / 2 - 10);
            } else if (this.gameManager.state.score2 > this.gameManager.state.score1) {
                text("Player 2 Wins!", width / 2, height / 2 - 10);
            } else {
                text("It's a Tie!", width / 2, height / 2 - 10);
            }
        }
        
        textSize(20);
        text("Press ENTER to Restart", width / 2, height / 2 + 100);
    }

    drawHelpButton() {
        fill(128);
        rect(width / 2 - 50, height / 2 + 80, 100, 40);
        fill(0);
        textSize(24);
        text("Help", width / 2, height / 2 + 100);
    }

    //========================
    //  help screen 
    //========================
    drawHelpScreen() {
        fill(220);
        rect(width/4, height/4, width/2, height/2);
        fill(0);
        textSize(20);
        textAlign(LEFT);
        let x = width/4 + 20;
        let y = height/4 + 40;
        text("游戏说明:", x, y);
        text("- 玩家1使用A/D移动，空格键放下草", x, y + 30);
        text("- 玩家2使用左右方向键移动，回车键放下草", x, y + 60);
        text("- 堆叠超过5个草会失去一条生命", x, y + 90);
        text("- 将草放入篮子可得分", x, y + 120);
        
        // 关闭按钮
        fill(255, 0, 0);
        rect(width/4 + width/2 - 60, height/4 + 20, 40, 40);
        fill(255);
        textSize(24);
        textAlign(CENTER);
        text("X", width/4 + width/2 - 40, height/4 + 45);
    }

    handleHelpScreenInput(mouseX, mouseY) {
        // 检查是否点击了关闭按钮
        if (mouseX > width/4 + width/2 - 60 && mouseX < width/4 + width/2 - 20 &&
            mouseY > height/4 + 20 && mouseY < height/4 + 60) {
            this.gameManager.state.showHelp = false;
        }
    }

    // ---- text info, part of game screen 
    displayGameInfo() {
        textAlign(LEFT);
        textSize(24);
        fill(0);
        
        // 左上角显示玩家分数
        text(`Player 1 Score: ${this.gameManager.state.score1}`, 20, 40);
        text(`Player 2 Score: ${this.gameManager.state.score2}`, 480, 40);
        
        // 中间显示当前等级
        textAlign(CENTER);
        text(`Level ${this.gameManager.state.level}`, width/2, 40);
        
        // 右上角显示菜单按钮
        this.drawMenuButton();
        
        // 左侧显示游戏信息
        textAlign(LEFT);
        text(`Total Score: ${this.gameManager.state.score1 + this.gameManager.state.score2}`, 20, 80);
        text(`Target: ${this.gameManager.state.targetScores[this.gameManager.state.level - 1]}`, 20, 120);
        text(`Time: ${this.gameManager.state.timer}s`, 20, 160);

        // 在底部显示生命值
        this.displayLives();
    }

    drawMenuButton() {
        fill(200);
        rect(width - 100, 20, 80, 40);
        fill(0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Menu", width - 60, 40);
    }

    displayLives() {
        textAlign(LEFT);
        fill(0);
        textSize(24);
        
        // 显示玩家1的生命值在左上角
        text("Player 1 Lives:", 20, 200);
        // 将红点移到下一行，y坐标增加25
        for (let i = 0; i < this.gameManager.state.lives1; i++) {
            fill(255, 0, 0);
            circle(50 + i * 30, 225, 20);
        }

        // 如果是双人模式，显示玩家2的生命值在右上角
        if (this.gameManager.state.isTwoPlayerMode) {
            fill(0);
            text("Player 2 Lives:", width - 250, 200);
            // 将红点移到下一行，y坐标增加25
            for (let i = 0; i < this.gameManager.state.lives2; i++) {
                fill(255, 0, 0);
                circle(width - 220 + i * 30, 225, 20);
            }
        }
    }

    // --- part of game pause screen 
    drawPauseMenu() {
        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, width, height);

        // 菜单背景
        fill(220);
        rect(width/4, height/4, width/2, height/2);

        // 菜单标题
        fill(0);
        textSize(24);
        textAlign(CENTER);
        text("Pause Menu", width/2, height/4 + 40);

        // 继续按钮
        fill(0, 255, 0);
        rect(width/2 - 60, height/2 - 40, 120, 40);
        fill(0);
        textSize(20);
        text("Continue", width/2, height/2 - 20);

        // 重新开始按钮
        fill(255, 165, 0);
        rect(width/2 - 60, height/2 + 20, 120, 40);
        fill(0);
        text("Restart", width/2, height/2 + 40);

        // 返回主菜单按钮
        fill(255, 0, 0);
        rect(width/2 - 60, height/2 + 80, 120, 40);
        fill(0);
        text("Main Menu", width/2, height/2 + 100);
    }

    handleFlashPause() {
        if (this.gameManager.flashTimer1 > 0 || this.gameManager.flashTimer2 > 0) {
            //no flashing if pause menu is shown, flashing goes on if pause menu if not shown
            this.gameManager.state.flashPaused = this.gameManager.state.showPauseMenu; 
        }
    }

    // ----- for mode selection screen 
    drawModeSelectionButtons() {
        // 首先绘制一个背景矩形来清除之前的内容
        fill(220);  // 使用和背景相同的颜色
        rect(0, 0, width, height);
        
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        // 标题文字
        text("Select Game Mode", width / 2, height / 4);
        
        // 提示文字
        textSize(28);
        text("Click Start to Begin", width / 2, height / 4 + 50);

        // 单人模式按钮 - 调整位置到中间偏上
        fill(0, 255, 0);
        rect(width / 2 - 100, height / 2 - 60, 200, 40);
        fill(0);
        textSize(24);
        text("1 Player", width / 2, height / 2 - 40);

        // 双人模式按钮 - 调整间距
        fill(0, 191, 255);
        rect(width / 2 - 100, height / 2, 200, 40);
        fill(0);
        text("2 Players", width / 2, height / 2 + 20);

        // 返回按钮 - 调整间距
        fill(255, 0, 0);
        rect(width / 2 - 50, height / 2 + 60, 100, 40);
        fill(0);
        text("Back", width / 2, height / 2 + 80);
    }


    //================================
    //two player mode selection screen 
    //=================================
    displayTwoPlayerOptions() {
        // 首先绘制一个背景矩形来清除之前的内容
        fill(220);  // 使用和背景相同的颜色
        rect(0, 0, width, height);
        
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        // 将标题文字放在最上方
        text("Select 2 Player Mode", width / 2, height / 4);
        
        // 将提示文字放在标题下方
        textSize(28);
        text("Click Start to Begin", width / 2, height / 4 + 50);

        // 合作模式按钮
        fill(0, 255, 0);
        rect(width / 2 - 100, height / 2 - 60, 200, 40);
        fill(0);
        textSize(24);
        text("Co-op Mode", width / 2, height / 2 - 40);

        // 对抗模式按钮
        fill(0, 191, 255);
        rect(width / 2 - 100, height / 2 + 20, 200, 40);
        fill(0);
        text("VS Mode", width / 2, height / 2 + 40);

        // 返回按钮
        fill(255, 0, 0);
        rect(width / 2 - 50, height / 2 + 100, 100, 40);
        fill(0);
        text("Back", width / 2, height / 2 + 120);
    }

    // button appear in the game screen before starting 
    displayLargeStartButton() {
        // 半透明背景
        fill(0, 0, 0, 127);
        rect(0, 0, width, height);
        
        // 大的半透明白色背景
        fill(255, 255, 255, 180);
        rect(width/2 - 150, height/2 - 50, 300, 100);
        
        // 按钮边框
        stroke(0);
        strokeWeight(2);
        noFill();
        rect(width/2 - 150, height/2 - 50, 300, 100);
        
        // 按钮文字
        noStroke();
        fill(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("START", width/2, height/2);
    }
}
