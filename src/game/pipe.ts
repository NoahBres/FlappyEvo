import Sprite from "./sprite";

export default class Pipe implements Sprite {
  private _x = 0;
  private _middleY = 0;

  private _width = 50;
  private _height = 40;

  private _openingSize = 120;

  private _speed = 3;

  private _topPipe: HTMLImageElement;
  private _bottomPipe: HTMLImageElement;

  constructor({
    x,
    middleY,
    openingSize,
    pipeSpeed,
    topPipe,
    bottomPipe
  }: ConstructorOptions) {
    this._x = x;
    this._middleY = middleY;
    this._openingSize = openingSize;
    this._speed = pipeSpeed;
    this._topPipe = topPipe;
    this._bottomPipe = bottomPipe;

    this._width = topPipe.width;
    this._height = topPipe.height;
  }

  tick() {
    this._x -= this._speed;
  }

  hitMe(x, y, width, height): boolean {
    // if(x + width < this._x ||
    //     x > this._x + this._width ||
    //     x < this._x + this._width &&
    //     x + width > this._width &&
    //     y < this._middleY - this._openingSize / 2 + this._openingSize &&
    //     y + height > this._middleY - this._openingSize / 2)
    //     return false;
    if (
      x + width < this._x ||
      x > this._x + this._width ||
      (y > this._middleY - this._openingSize / 2 &&
        y + height < this._middleY + this._openingSize / 2)
    )
      return false;

    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // ctx.drawImage(this._topPipe, this._x, this._y + this._height - this._topPipe.height, this._width, this._topPipe.height);
    // ctx.drawImage(this._topPipe, this._x, this._y, this._width, this._topPipe.height);
    ctx.drawImage(
      this._topPipe,
      this._x,
      this._middleY - this._openingSize / 2 - this._topPipe.height,
      this._width,
      this._topPipe.height
    );
    ctx.drawImage(
      this._bottomPipe,
      this._x,
      this._middleY + this._openingSize / 2,
      this._width,
      this._bottomPipe.height
    );

    // Debug drawings
    // ctx.fillRect(this._x + this.width / 2 - 1, this._middleY - 1, 3, 3);
    // ctx.strokeRect(
    //   this._x,
    //   this._middleY - this._openingSize / 2,
    //   this._width,
    //   this._openingSize
    // );
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._middleY;
  }

  get width(): number {
    return this._width;
  }
}

interface ConstructorOptions {
  x: number;
  middleY: number;
  openingSize: number;
  pipeSpeed: number;
  topPipe: HTMLImageElement;
  bottomPipe: HTMLImageElement;
}
