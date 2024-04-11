export default class Bunker {
  constructor(x, y, sprite, hp) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.hp = hp;
  }

  draw(ctx) {
    ctx.drawImage(
      this.sprite.img,
      this.sprite.x,
      this.sprite.y,
      this.sprite.w,
      this.sprite.h,
      this.x,
      this.y,
      this.sprite.w,
      this.sprite.h
    );
    const prevFillStyle = ctx.fillStyle;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.hp.toString(), this.x, this.y);
    ctx.fillStyle = prevFillStyle;
  }
}
