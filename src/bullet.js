import { handleEnemyKill, showGameOverScreen } from "./game";
export default class Bullet {
  constructor(x, y, vy, w, h, color, isEnemy) {
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.w = w;
    this.h = h;
    this.color = color;
    this.isActive = true;
    this.isEnemy = isEnemy;
  }

  update(time, gameState) {
    this.y += this.vy;
    if (this.isActive) {
      if (!this.isEnemy) {
        this.handleCollisionWithAliens(gameState.aliens);
      }
      this.handleCollisionWithBunkers(gameState.bunkers);
      this.handleCollisionWithCannon(gameState.cannon);
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  checkCollisionWithObject(object) {
    return (
      this.x < object.x + object.sprite.w &&
      this.x + this.w > object.x &&
      this.y < object.y + object.sprite.h &&
      this.y + this.h > object.y
    );
  }

  handleCollisionWithCannon(cannon) {
    if (this.checkCollisionWithObject(cannon)) {
      cannon.hp--;
      this.isActive = false;
      return;
    }
  }

  handleCollisionWithAliens(aliens) {
    for (let i = 0; i < aliens.length; i++) {
      if (this.checkCollisionWithObject(aliens[i])) {
        aliens[i].hp--;
        this.isActive = false;
        if (aliens[i].hp <= 0) {
          handleEnemyKill();
          aliens.splice(i, 1);
        }
        return;
      }
    }
  }

  handleCollisionWithBunkers(bunkers) {
    for (let i = 0; i < bunkers.length; i++) {
      if (this.checkCollisionWithObject(bunkers[i])) {
        bunkers[i].hp--;
        this.isActive = false;
        if (bunkers[i].hp <= 0) {
          bunkers.splice(i, 1);
        }
        return;
      }
    }
  }
}
