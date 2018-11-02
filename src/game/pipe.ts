import Sprite from "./sprite";

export default class Pipe implements Sprite {
	private _topPipe: HTMLImageElement;
	private _bottomPipe: HTMLImageElement;

	private _x: number;
	private _y: number;
	private _width = 50;
	private _height: number;

	private _speed = 3;

	// Size of the opening in the pipe
	private _opening = 120;

	constructor(
		x: number,
		maxHeight: number,
		speed: number,
		topPipe: HTMLImageElement,
		bottomPipe: HTMLImageElement
	) {
		this._x = x;
		const space = maxHeight - this._opening;
		this._y = maxHeight - space * Math.random();

		this._speed = speed;

		this._topPipe = topPipe;
		this._bottomPipe = bottomPipe;
		this._height = topPipe.height;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(
			this._topPipe,
			this._x,
			this._y - this._opening - this._height,
			this._width,
			this._height
		);

		ctx.drawImage(
			this._bottomPipe,
			this._x,
			this._y,
			this._width,
			this._height
		);
	}

	tick() {
		this._x -= this._speed;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	get width(): number {
		return this._width;
	}

	get opening(): number {
		return this._opening;
	}

	get height(): number {
		return this._height;
	}

	set height(height: number) {
		this._height = height;
	}
}
