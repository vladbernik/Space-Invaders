import Sprite from "./sprite";
import Cannon from "./cannon";
import Bullet from "./bullet";
import Alien from "./alien";
import InputHandler from "./input-handler";
import { canvas } from ".";
import assetPath from "../assets/invaders.png";
import Bunker from "./bunkers";
import { bulletSound } from ".";
import { mainSound } from ".";

let assets;
const sprites = {
  aliens: [],
  cannon: null,
  bunker: null,
};
const gameState = {
  bullets: [],
  aliens: [],
  cannon: null,
  bunkers: [],
  gameOver: false,
  score: 0,
};
let direction = 1;
let killedAliens = 0;
let isEnhancedMode = false;
const inputHandler = new InputHandler();

export function preload(onPreloadComplete) {
  assets = new Image();
  assets.addEventListener("load", () => {
    sprites.cannon = new Sprite(assets, 62, 0, 22, 16);
    sprites.bunker = new Sprite(assets, 84, 8, 36, 24);
    sprites.aliens = [
      [new Sprite(assets, 0, 0, 22, 16), new Sprite(assets, 0, 16, 22, 16)],
      [new Sprite(assets, 22, 0, 16, 16), new Sprite(assets, 22, 16, 16, 16)],
      [new Sprite(assets, 38, 0, 24, 16), new Sprite(assets, 38, 16, 24, 16)],
    ];

    onPreloadComplete();
  });
  assets.src = assetPath;
}

export function init(canvas) {
  for (let i = 0; i < 6; i++) {
    gameState.bunkers.push(
      new Bunker(70 + i * 70, canvas.height - 140, sprites.bunker, 8)
    );
  }
  const alienTypes = [
    { type: 0, hp: 1 },
    { type: 1, hp: 3 },
    { type: 0, hp: 1 },
    { type: 0, hp: 1 },
    { type: 2, hp: 3 },
    { type: 0, hp: 1 },
  ];
  for (var i = 0, len = alienTypes.length; i < len; i++) {
    for (var j = 0; j < 10; j++) {
      const { type, hp } = alienTypes[i];

      let alienX = 30 + j * 30;
      let alienY = 30 + i * 30;

      if (type === 1) {
        alienX += 3; // (kostyl) aliens of this type is a bit thinner
      }

      gameState.aliens.push(
        new Alien(alienX, alienY, sprites.aliens[type], hp)
      );
    }
  }

  gameState.cannon = new Cannon(100, canvas.height - 100, sprites.cannon, 5);

  mainSound.play();
}
export function resetGame() {
  // Сбросить переменные игрового состояния
  gameState.bullets = [];
  gameState.aliens = [];
  gameState.gameOver = false;
  gameState.score = 0;
  direction = 1;
  killedAliens = 0;
  isEnhancedMode = false;

  // Пересоздать алиенов
  const alienTypes = [
    { type: 0, hp: 1 },
    { type: 1, hp: 3 },
    { type: 0, hp: 1 },
    { type: 0, hp: 1 },
    { type: 2, hp: 3 },
    { type: 0, hp: 1 },
  ];
  for (var i = 0, len = alienTypes.length; i < len; i++) {
    for (var j = 0; j < 10; j++) {
      const { type, hp } = alienTypes[i];

      let alienX = 30 + j * 30;
      let alienY = 30 + i * 30;

      if (type === 1) {
        alienX += 3; // (kostyl) aliens of this type is a bit thinner
      }

      gameState.aliens.push(
        new Alien(alienX, alienY, sprites.aliens[type], hp)
      );
    }
  }

  // Пересоздать пушки и бункеры
  gameState.cannon = new Cannon(100, canvas.height - 100, sprites.cannon, 5);
  gameState.bunkers = [];
  for (let i = 0; i < 6; i++) {
    gameState.bunkers.push(
      new Bunker(70 + i * 70, canvas.height - 140, sprites.bunker, 8)
    );
  }
}

// Добавьте вызов resetGame там, где вы хотите начать новую игру
// Например, в функции обработки нажатия клавиши "N" или "R"
function startNewGame() {
  // Reset the game state and start a new game
  resetGame();
}

export function update(time, stopGame) {
  if (inputHandler.isDown("ArrowLeft")) {
    gameState.cannon.x -= 4;
    if (gameState.cannon.x < 0) {
      gameState.cannon.x = canvas.width; 
    }
  }

  if (inputHandler.isDown("ArrowRight")) {
    gameState.cannon.x += 4;
    if (gameState.cannon.x > canvas.width) {
      gameState.cannon.x = 0; 
    }
  }

  if (inputHandler.isPressed("Space")) {
    const bulletX = gameState.cannon.x + 10;
    const bulletY = gameState.cannon.y;
    gameState.bullets.push(
      new Bullet(bulletX, bulletY, -8, 2, 6, "#fff", false)
    );

    bulletSound.play();
  }

  handleAlienShoot();
  if (inputHandler.isPressed("KeyN")) {
    startNewGame();
  }
  if (gameState.cannon.hp <= 0) {
    gameState.gameOver = true;
    //stopGame();
    if (inputHandler.isPressed("KeyN")) {
      startNewGame();
    }
  }
  if (gameState.aliens.length === 0) {
    gameState.gameOver = true;
    //stopGame();
    if (inputHandler.isPressed("KeyN")) {
      startNewGame();
    }
  }
  gameState.bullets.forEach((b) => {
    b.update(time, gameState);
    if (b.y < 0 || b.y > canvas.height) {
      b.isActive = false;
    }
  });
  gameState.bullets = gameState.bullets.filter((bullet) => bullet.isActive);

  gameState.aliens.forEach((alien) => {
    alien.x += 1 * direction; 
  });
  if (
    gameState.aliens.some(
      (alien) => alien.x <= 0 || alien.x >= canvas.width - alien._spriteA.w
    )
  ) {
    direction *= -1;
    gameState.aliens.forEach((alien) => {
      alien.y += 30; 
    });
  }
}

export function draw(canvas, time) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameState.aliens.forEach((a) => a.draw(ctx, time));
  gameState.cannon.draw(ctx);
  gameState.bullets.forEach((b) => b.draw(ctx));
  gameState.bunkers.forEach((bunker) => bunker.draw(ctx));

  // hp
  for (let i = 0; i < gameState.cannon.hp; i++) {
    const x = 10 + i * 30;
    const y = canvas.height - 40;
    ctx.drawImage(
      gameState.cannon._sprite.img,
      gameState.cannon._sprite.x,
      gameState.cannon._sprite.y,
      gameState.cannon._sprite.w,
      gameState.cannon._sprite.h,
      x,
      y,
      gameState.cannon._sprite.w,
      gameState.cannon._sprite.h
    );
  }
  ctx.font = "bold 20px monospace"; 
  ctx.fillStyle = "#fff"; 
  ctx.textAlign = "left"; 
  ctx.fillText("Score: " + gameState.score, 0, 20);

  if (gameState.gameOver && isGameWin()) {
    drawGameWin(ctx);
  } else if (gameState.gameOver) {
    drawGameOver(ctx);
  }
}

export function handleEnemyKill() {
  killedAliens++;
  gameState.score += 10;
  if (killedAliens % 10 === 0) {
    isEnhancedMode = true; 
    setTimeout(() => {
      isEnhancedMode = false;
    }, 5000); 
  }
}

let lastShotTime = 0; 
const shootDelay = 100;
function handleAlienShoot() {
  const currentTime = Date.now();

  if (currentTime - lastShotTime >= shootDelay) {
    const randomIndex = Math.floor(Math.random() * gameState.aliens.length);
    const randomAlien = gameState.aliens[randomIndex];

    if (randomAlien) {
      const bulletX = randomAlien.x;
      const bulletY = randomAlien.y + randomAlien.sprite.h; 
      let bulletSpeed = 3;
      let bulletColor = "#fff";

      if (isEnhancedMode) {
        bulletSpeed = 10;
        bulletColor = "#ff0000";
      }

      gameState.bullets.push(
        new Bullet(bulletX, bulletY, bulletSpeed, 2, 6, bulletColor, true)
      );
    }
    lastShotTime = currentTime;
  }
}

function drawGameOver(ctx) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 50px monospace";
  ctx.fillStyle = "#fff"; 
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  ctx.font = "bold 30px monospace";
  ctx.fillText("Score: " + gameState.score, canvas.width / 2, canvas.height / 2 + 50);

  ctx.font = "bold 20px monospace";
  ctx.fillText("Press 'N' for New Game", canvas.width / 2, canvas.height / 2 + 100);
}

function drawGameWin(ctx) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 50px monospace";
  ctx.fillStyle = "#fff"; 
  ctx.textAlign = "center";
  ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);

  ctx.font = "bold 30px monospace";
  ctx.fillText("Score: " + gameState.score, canvas.width / 2, canvas.height / 2 + 50);

  ctx.font = "bold 20px monospace";
  ctx.fillText("Press 'N' for New Game", canvas.width / 2, canvas.height / 2 + 100);
}
function isGameWin() {
  return gameState.aliens.length === 0;
}
