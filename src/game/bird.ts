import Sprite from "./sprite";
import Cerebrum from "../Cerebrum.js/cerebrum";

export default class Bird implements Sprite {
	private _image: HTMLImageElement;
	private _imageDead: HTMLImageElement;

	private _x = 80;
	private _y = 250;
	private _width = 40;
	private _height = 30;

	private _yBoundary = 500;

	private _alive = true;
	private _gravity = 0;
	private _velocity = 0.3;
	private _jump = -6;

	private _pipeSpeed = 3;

	private _brain: Cerebrum;

	constructor(
		x: number,
		y: number,
		yBoundary: number,
		pipeSpeed: number,
		image: HTMLImageElement,
		imageDead: HTMLImageElement,
		brain: Cerebrum
	) {
		this._x = x;
		this._y = y;
		this._image = image;
		this._yBoundary = yBoundary;
		this._pipeSpeed = pipeSpeed;
		this._imageDead = imageDead;
		this._brain = brain;
	}

	tick() {
		if (!this._alive) {
			this._x -= this._pipeSpeed;
		} else if (this._y > this._yBoundary) {
			this._alive = false;
		} else {
			this._gravity += this._velocity;
			this._y += this._gravity;
		}

		// if(this._y > 512)
		// 	this._y += this._gravity;
	}

	flap() {
		if (this._y > 0) this._gravity = this._jump;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.translate(this._x + this._width / 2, this._y + this._height / 2);

		if (this._alive) {
			ctx.rotate(((Math.PI / 2) * this._gravity) / 20);
			ctx.globalAlpha = 0.7;
		} else {
			ctx.rotate((Math.PI / 2) * 45);
			//ctx.filter = 'hue-rotate(45deg)';
		}
		//ctx.drawImage(this._image, this._x, this._y, this._width, this._height);
		ctx.drawImage(
			this._alive ? this._image : this._imageDead,
			-this._width / 2,
			-this._height / 2,
			this._width,
			this._height
		);
		ctx.restore();
	}

	get x(): number {
		return this._x;
	}

	set x(x: number) {
		this._x = x;
	}

	get y(): number {
		return this._y;
	}

	set y(y: number) {
		this._y = y;
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}

	get alive(): boolean {
		return this._alive;
	}

	set alive(value: boolean) {
		this._alive = value;
	}

	get gravity(): number {
		return this._gravity;
	}

	get brain(): Cerebrum {
		return this._brain;
	}

	set brain(brain: Cerebrum) {
		this._brain = brain;
	}
}
