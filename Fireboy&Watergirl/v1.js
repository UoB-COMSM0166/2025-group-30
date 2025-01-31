let players;
const playerSize = 40;
const gravity = 1;
const groundY = 550;
let obstacles;
let exit;
let diamonds;
let movingPlatforms;
let score = 0;
let timer = 60; // 倒计时 60 秒
let platformSpeed = 2;

function setup() {
  createCanvas(1200, 600); // 增大画布尺寸以支持 S 型地图

  // 初始化玩家角色
  players = {
    ice: {
      x: 50,
      y: groundY - playerSize,
      width: playerSize,
      height: playerSize,
      color: 'blue',
      dx: 0,
      dy: 0,
      onGround: false,
      onMovingPlatform: null,
    },
    fire: {
      x: 100,
      y: groundY - playerSize,
      width: playerSize,
      height: playerSize,
      color: 'red',
      dx: 0,
      dy: 0,
      onGround: false,
      onMovingPlatform: null,
    },
  };

  // S 型地图设计的障碍物与通道
  obstacles = [
    { x: 1100, y: 90, width: 70, height: 20, type: 'neutral' }, // 支撑地面
    { x: 100, y: 500, width: 200, height: 20, type: 'neutral' },
    { x: 400, y: 450, width: 200, height: 20, type: 'fire' },
    { x: 700, y: 400, width: 200, height: 20, type: 'water' },
    { x: 300, y: 350, width: 200, height: 20, type: 'neutral' },
    { x: 600, y: 300, width: 200, height: 20, type: 'fire' },
    { x: 900, y: 250, width: 200, height: 20, type: 'water' },
        { x: 800, y: 150, width: 200, height: 20, type: 'neutral' },
  ];

  exit = {
    x: 1100,
    y: 50, // 设置在屏幕右上角
    width: 50,
    height: 40,
    color: 'green',
  };

  // 初始化钻石
  diamonds = [
    { x: 350, y: 420, collected: false },
    { x: 750, y: 380, collected: false },
    { x: 950, y: 180, collected: false },
  ];

  // 初始化移动平台
  movingPlatforms = [
    { x: 200, y: 450, width: 100, height: 20, direction: 1 },
    { x: 600, y: 250, width: 100, height: 20, direction: -1 },
  ];

  // 倒计时
  setInterval(() => {
    if (timer > 0) timer--;
  }, 1000);
}

function draw() {
  background(34);

  // 显示时间和得分
  drawHUD();

  // 更新移动平台位置
  updateMovingPlatforms();

  // 输入处理
  handleInput();

  // 更新玩家
  updatePlayer(players.ice);
  updatePlayer(players.fire);

  // 检测碰撞与胜利条件
  checkCollisions();
  checkWinCondition();
  collectDiamonds();

  // 绘制场景
  drawGround();
  drawObstacles();
  drawMovingPlatforms();
  drawDiamonds();
  drawExit();
  drawPlayer(players.ice);
  drawPlayer(players.fire);

  // 检查时间是否结束
  if (timer <= 0) {
    noLoop();
    console.log('时间耗尽！游戏失败！');
  }
}

function drawHUD() {
  fill(255);
  textSize(20);
  text(`时间: ${timer}s`, 20, 30);
  text(`得分: ${score}`, 20, 60);
}

function handleInput() {
  // 冰人 (WASD)
  if (keyIsDown(65)) players.ice.dx = -5; // A
  else if (keyIsDown(68)) players.ice.dx = 5; // D
  else players.ice.dx = 0;

  if (keyIsDown(87) && players.ice.onGround) { // W
    players.ice.dy = -15;
    players.ice.onGround = false;
    players.ice.onMovingPlatform = null;
  }

  // 火人 (箭头键)
  if (keyIsDown(LEFT_ARROW)) players.fire.dx = -5;
  else if (keyIsDown(RIGHT_ARROW)) players.fire.dx = 5;
  else players.fire.dx = 0;

  if (keyIsDown(UP_ARROW) && players.fire.onGround) {
    players.fire.dy = -15;
    players.fire.onGround = false;
    players.fire.onMovingPlatform = null;
  }
}

function updatePlayer(player) {
  if (player.onMovingPlatform) {
    player.x += player.onMovingPlatform.direction * platformSpeed;
  }

  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.onGround = true;
    player.onMovingPlatform = null;
  }

  let onPlatform = false;
  movingPlatforms.forEach((platform) => {
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 10
    ) {
      player.y = platform.y - player.height;
      player.dy = 0;
      player.onGround = true;
      player.onMovingPlatform = platform;
      onPlatform = true;
    }
  });

  if (!onPlatform) {
    player.onMovingPlatform = null;
    obstacles.forEach((obs) => {
      if (
        player.x + player.width > obs.x &&
        player.x < obs.x + obs.width &&
        player.y + player.height >= obs.y &&
        player.y + player.height <= obs.y + 10
      ) {
        if ((obs.type === 'fire' && player.color === 'blue') ||
            (obs.type === 'water' && player.color === 'red') ||
            (obs.type === 'green')) {
          console.log(`${player.color === 'blue' ? '冰人' : '火人'} 被障碍物杀死！`);
          resetGame();
        } else {
          player.y = obs.y - player.height;
          player.dy = 0;
          player.onGround = true;
        }
      }
    });
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > width) player.x = width - player.width;
}

function updateMovingPlatforms() {
  movingPlatforms.forEach((platform) => {
    platform.x += platformSpeed * platform.direction;
    if (platform.x <= 100 || platform.x + platform.width >= 1100) {
      platform.direction *= -1;
    }
  });
}

function drawPlayer(player) {
  fill(player.color);
  rect(player.x, player.y, player.width, player.height);
}

function drawGround() {
  fill('green');
  rect(0, groundY, width, height - groundY);
}

function drawObstacles() {
  obstacles.forEach((obs) => {
    fill(
      obs.type === 'fire' ? 'red' : obs.type === 'water' ? 'blue' : obs.type === 'green' ? 'lime' : 'gray'
    );
    rect(obs.x, obs.y, obs.width, obs.height);
  });
}

function drawMovingPlatforms() {
  fill('orange');
  movingPlatforms.forEach((platform) => {
    rect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawDiamonds() {
  diamonds.forEach((diamond) => {
    if (!diamond.collected) {
      fill('cyan');
      ellipse(diamond.x, diamond.y, 20, 20);
    }
  });
}

function collectDiamonds() {
  diamonds.forEach((diamond) => {
    if (!diamond.collected &&
      players.ice.x < diamond.x + 10 && players.ice.x + players.ice.width > diamond.x - 10 &&
      players.ice.y < diamond.y + 10 && players.ice.y + players.ice.height > diamond.y - 10
    ) {
      diamond.collected = true;
      score += 10;
    }

    if (!diamond.collected &&
      players.fire.x < diamond.x + 10 && players.fire.x + players.fire.width > diamond.x - 10 &&
      players.fire.y < diamond.y + 10 && players.fire.y + players.fire.height > diamond.y - 10
    ) {
      diamond.collected = true;
      score += 10;
    }
  });
}

function checkCollisions() {
  obstacles.forEach((obs) => {
    if (
      players.ice.x < obs.x + obs.width &&
      players.ice.x + players.ice.width > obs.x &&
      players.ice.y < obs.y + obs.height &&
      players.ice.y + players.ice.height > obs.y
    ) {
      if (obs.type === 'fire' || obs.type === 'green') {
        console.log('冰人死亡！');
        resetGame();
      }
    }

    if (
      players.fire.x < obs.x + obs.width &&
      players.fire.x + players.fire.width > obs.x &&
      players.fire.y < obs.y + obs.height &&
      players.fire.y + players.fire.height > obs.y
    ) {
      if (obs.type === 'water' || obs.type === 'green') {
        console.log('火人死亡！');
        resetGame();
      }
    }
  });
}

function resetGame() {
  console.log('游戏重置！');
  players.ice.x = 50;
  players.ice.y = groundY - playerSize;
  players.fire.x = 100;
  players.fire.y = groundY - playerSize;
  score = 0;
}

function checkWinCondition() {
  if (
    players.ice.x < exit.x + exit.width &&
    players.ice.x + players.ice.width > exit.x &&
    players.ice.y < exit.y + exit.height &&
    players.ice.y + players.ice.height > exit.y &&
    players.fire.x < exit.x + exit.width &&
    players.fire.x + players.fire.width > exit.x &&
    players.fire.y < exit.y + exit.height &&
    players.fire.y + players.fire.height > exit.y
  ) {
    console.log('恭喜！冰人和火人成功到达出口！游戏通关！');
    noLoop();
  }
}

function drawExit() {
  // 绘制支撑地面
  fill('gray');
  rect(1100, 90, 70, 20);
  fill(exit.color);
  rect(exit.x, exit.y, exit.width, exit.height);
}
