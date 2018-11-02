import Sprite from "./sprite";

export default class Pipe implements Sprite {
	private _topPipe: HTMLImageElement;
	private _bottomPipe: HTMLImageElement;

	private _x: number;
	private _y: number;
	private _width = 50;
	private _height: number;

<<<<<<< HEAD
	private _speed = 3;

=======
	private _bgOffset: number;
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
	// Size of the opening in the pipe
	private _opening = 120;

	constructor(
		x: number,
		maxHeight: number,
<<<<<<< HEAD
		speed: number,
=======
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
		topPipe: HTMLImageElement,
		bottomPipe: HTMLImageElement
	) {
		this._x = x;
		const space = maxHeight - this._opening;
		this._y = maxHeight - space * Math.random();

<<<<<<< HEAD
		this._speed = speed;

=======
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
		this._topPipe = topPipe;
		this._bottomPipe = bottomPipe;
		this._height = topPipe.height;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(
			this._topPipe,
<<<<<<< HEAD
			this._x,
=======
			this._x - this._bgOffset,
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
			this._y - this._opening - this._height,
			this._width,
			this._height
		);

		ctx.drawImage(
			this._bottomPipe,
<<<<<<< HEAD
			this._x,
=======
			this._x - this._bgOffset,
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
			this._y,
			this._width,
			this._height
		);
	}

<<<<<<< HEAD
	tick() {
		this._x -= this._speed;
	}

=======
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
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
<<<<<<< HEAD
=======

	set bgOffset(bgOffset: number) {
		this._bgOffset = bgOffset;
	}
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
}
