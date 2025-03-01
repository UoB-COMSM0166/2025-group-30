class InputHandler {
   constructor(gameManager) {
       this.gameManager = gameManager;
   }

   handleKeyPressed(keyCode) {
      //console.log("2 players mode:", this.gameManager.state.isTwoPlayerMode);
      //console.log("gameStarted:", this.gameManager.state.gameStarted);

      // --- game over ----
       if (this.gameManager.state.gameOver && keyCode === ENTER) {
           this.gameManager.restartGame();
           return;
       }

        // --- game paused or at not in game screen e.g. help screen, menu screen etc ----
       if (this.gameManager.state.paused || !this.gameManager.state.gameStarted) {
         return;
       }

       // --- game screen (single, coop and pvp) ----
       // 玩家1的控制
       if (keyCode === 65) { // A键
           this.gameManager.moveDirection1 = -1;
       } else if (keyCode === 68) { // D键
           this.gameManager.moveDirection1 = 1;
       } else if (keyCode === 32) { // 空格键
           if (this.gameManager.player1) {
               this.gameManager.player1.dropGrass();
           }
       }
       
       // --- coop and pvp game screen ---
       // 玩家2的控制
       if (this.gameManager.state.isTwoPlayerMode) {
           if (keyCode === LEFT_ARROW) {
               this.gameManager.moveDirection2 = -1;
           } else if (keyCode === RIGHT_ARROW) {
               this.gameManager.moveDirection2 = 1;
           } else if (keyCode === 13) { // Enter键
               //if (this.gameManager.player2) {
                   //console.log("Player 2 attempting to drop grass");
                   this.gameManager.player2.dropGrass();
               //}
           }
       }
   }

   handleKeyReleased(keyCode) {
       // 玩家1的控制
       if (keyCode === 65 && this.gameManager.moveDirection1 === -1) { // A键
           this.gameManager.moveDirection1 = 0;
       } else if (keyCode === 68 && this.gameManager.moveDirection1 === 1) { // D键
           this.gameManager.moveDirection1 = 0;
       }
       
       // 玩家2的控制
       if (this.gameManager.state.isTwoPlayerMode) {
           if (keyCode === LEFT_ARROW && this.gameManager.moveDirection2 === -1) {
               this.gameManager.moveDirection2 = 0;
           } else if (keyCode === RIGHT_ARROW && this.gameManager.moveDirection2 === 1) {
               this.gameManager.moveDirection2 = 0;
           }
       }
   }

   handleMousePressed(mouseX, mouseY) {
        // --- not in game screen i.e. game not running ---
       if (!this.gameManager.state.startGame) {
           this.handleStartScreenInput(mouseX, mouseY);
       } else { // --- game screen (single, coop and pvp) ---- 
           this.handleGameInput(mouseX, mouseY);
       }
   }

   // --- not in game screen i.e. game not running ---
   handleStartScreenInput(mouseX, mouseY) {
       if (!this.gameManager.state.showModeSelection) { // --- not in menu screen ---
           if (this.gameManager.state.showHelp) { // --- in help screen ---
               this.gameManager.uiManager.handleHelpScreenInput(mouseX, mouseY);
           } else { // --- in home screen ---
               this.handleMainMenuInput(mouseX, mouseY);
           }
       } else if (!this.gameManager.state.showTwoPlayerOptions) {
           this.handleModeSelectionInput(mouseX, mouseY);
       } else {
           this.handleTwoPlayerOptionsInput(mouseX, mouseY);
       }
   }

   handleGameInput(mouseX, mouseY) {
       // 检查是否点击了菜单按钮
       if (mouseX > width - 100 && mouseX < width - 20 && 
           mouseY > 20 && mouseY < 60) {
           this.gameManager.state.showPauseMenu = !this.gameManager.state.showPauseMenu;
           this.gameManager.state.paused = this.gameManager.state.showPauseMenu;
           this.gameManager.uiManager.handleFlashPause();
           return;
       }

       // 如果显示菜单，处理菜单按钮点击
       if (this.gameManager.state.showPauseMenu) {
           this.handlePauseMenuInput(mouseX, mouseY);
           return;
       }

       // 检查是否点击了开始按钮
       if (!this.gameManager.state.gameStarted) {
           if (mouseX > width/2 - 150 && mouseX < width/2 + 150 &&
               mouseY > height/2 - 50 && mouseY < height/2 + 50) {
               this.gameManager.state.gameStarted = true;
               this.gameManager.startGrassDrop();
               return;
           }
       }

       // 检查关卡完成屏幕
       if (this.gameManager.state.showLevelUpScreen) {
           this.handleLevelUpScreenInput(mouseX, mouseY);
       }
   }

   handleMainMenuInput(mouseX, mouseY) { // --- in home screen ---
       // 模式选择按钮
       if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
           mouseY > height / 2 - 20 && mouseY < height / 2 + 20) {
           this.gameManager.state.showModeSelection = true;
       }
       
       // 帮助按钮
       if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
           mouseY > height / 2 + 40 && mouseY < height / 2 + 80) {
           this.gameManager.state.showHelp = true;
       }
   }

   handleModeSelectionInput(mouseX, mouseY) {
       // 打印鼠标坐标，帮助调试
       //console.log(`Mouse clicked at: ${mouseX}, ${mouseY}`);
       
       // 单人模式按钮
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 - 60 && mouseY < height / 2 - 20) {
           this.gameManager.state.mode = "1 Player";
           this.gameManager.state.showModeSelection = false;
           this.gameManager.state.isTwoPlayerMode = false;
           this.gameManager.state.isPlayAgainstMode = false;
           this.gameManager.state.startGame = true;
           this.gameManager.state.isTwoPlayerMode = false;
           this.gameManager.state.isPlayAgainstMode = false;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.basket1.active = true;
           this.gameManager.basket2.active = false;
           this.gameManager.startGrassDrop();
       }
       
       // 双人模式按钮 - 调整点击区域以匹配显示区域
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 && mouseY < height / 2 + 40) {
           this.gameManager.state.showTwoPlayerOptions = true;
       }
       
       // 返回按钮 - 调整点击区域以匹配显示区域
       if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
           mouseY > height / 2 + 60 && mouseY < height / 2 + 100) {
           this.gameManager.state.showModeSelection = false;
       }
   }

   handleTwoPlayerOptionsInput(mouseX, mouseY) {
       // 合作模式按钮 (Co-op Mode)
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 - 60 && mouseY < height / 2 - 20) {
           this.gameManager.state.mode = "2 Players Co-op";
           this.gameManager.state.isTwoPlayerMode = true;
           this.gameManager.state.isPlayAgainstMode = false;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.state.showModeSelection = false;
           this.gameManager.state.startGame = true;
           this.gameManager.state.isTwoPlayerMode = true;
           this.gameManager.state.isPlayAgainstMode = false;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.basket1.active = true;
           this.gameManager.basket2.active = false;
           this.gameManager.startGrassDrop();
       }
       
       // 对抗模式按钮 (VS Mode)
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 + 20 && mouseY < height / 2 + 60) {
           this.gameManager.state.mode = "2 Players VS";
           this.gameManager.state.isTwoPlayerMode = true;
           this.gameManager.state.isPlayAgainstMode = true;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.state.showModeSelection = false;
           this.gameManager.state.startGame = true;
           this.gameManager.state.isTwoPlayerMode = true;
           this.gameManager.state.isPlayAgainstMode = true;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.basket1.active = true;
           this.gameManager.basket2.active = true;
           this.gameManager.updateGameMode(); // 在构造函数中调用
           this.gameManager.startGrassDrop();
       }
       
       // 返回按钮
       if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
           mouseY > height / 2 + 100 && mouseY < height / 2 + 140) {
           this.gameManager.state.showTwoPlayerOptions = false;
       }
   }

   handleLevelUpScreenInput(mouseX, mouseY) {
       // 下一关按钮
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 && mouseY < height / 2 + 50) {
           this.gameManager.levelUp();
       }
       
       // 返回主菜单按钮
       if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
           mouseY > height / 2 + 70 && mouseY < height / 2 + 120) {
           this.gameManager.state.showLevelUpScreen = false;
           this.gameManager.state.startGame = false;
           this.gameManager.state.paused = false;
           this.gameManager.restartGame();
       }
   }

   handlePauseMenuInput(mouseX, mouseY) {
       // 继续按钮
       if (mouseX > width/2 - 60 && mouseX < width/2 + 60 &&
           mouseY > height/2 - 40 && mouseY < height/2) {
           this.gameManager.state.showPauseMenu = false;
           this.gameManager.state.paused = false;
           return;
       }
       
       // 重新开始按钮 - 保持当前模式
       if (mouseX > width/2 - 60 && mouseX < width/2 + 60 &&
           mouseY > height/2 + 20 && mouseY < height/2 + 60) {
           let currentMode = this.gameManager.state.mode;
           let isTwoPlayer = this.gameManager.state.isTwoPlayerMode;
           let isPlayAgainst = this.gameManager.state.isPlayAgainstMode;
           
           this.gameManager.restartGame();
           
           // 恢复当前模式的设置
           this.gameManager.state.mode = currentMode;
           this.gameManager.state.isTwoPlayerMode = isTwoPlayer;
           this.gameManager.state.isPlayAgainstMode = isPlayAgainst;
           this.gameManager.state.showPauseMenu = false;
           this.gameManager.state.startGame = true;
           this.gameManager.state.gameStarted = false;
           return;
       }
       
       // 返回主菜单按钮
       if (mouseX > width/2 - 60 && mouseX < width/2 + 60 &&
           mouseY > height/2 + 80 && mouseY < height/2 + 120) {
           // 完全重置游戏状态
           this.gameManager.restartGame();
           // 设置为初始界面状态
           this.gameManager.state.startGame = false;
           this.gameManager.state.showPauseMenu = false;
           this.gameManager.state.showModeSelection = false;
           this.gameManager.state.showTwoPlayerOptions = false;
           this.gameManager.state.gameStarted = false;
           this.gameManager.state.mode = "1 Player";
           this.gameManager.state.isTwoPlayerMode = false;
           this.gameManager.state.isPlayAgainstMode = false;
           
           // 清除所有计时器
           if (this.gameManager.grassDropInterval) {
               clearInterval(this.gameManager.grassDropInterval);
           }
           if (this.gameManager.levelTimerInterval) {
               clearInterval(this.gameManager.levelTimerInterval);
           }
           return;
       }
   }
}
