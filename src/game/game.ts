import SpriteMap from "./sprite_map";
import Pipe from "./pipe";

export default class Game {
	private _imgsLoaded = false;

	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;

	// Duration of frame
	private _frameDuration = 1000 / (60 * 1);
	// Offset of background
	private _bgDistance = 0;
	// Background speed
	private _bgSpeed = 2;
	// New pipe spawn interval
	private _pipeSpawnInterval = 240;
	// Generated pipes
	private _pipes: Array<Pipe> = [];

	private _pipeOffset: number;

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
	}

	init() {
		if (!this._imgsLoaded) {
			SpriteMap.loadSprites().then(images => {
				console.log(images);
				this._imgsLoaded = true;
				this.start();
			});
		}
	}

	start() {
		// Spawn a bunch of pipes
		let offset = this._pipeSpawnInterval;
		do {
			this._pipes.push(
				new Pipe(
					offset,
					this._canvas.height,
					SpriteMap.sprites.pipetop.image,
					SpriteMap.sprites.pipebottom.image
				)
			);
			offset += this._pipeSpawnInterval;
		} while (offset < this._canvas.width);

		setInterval(() => {
			this.tick();
		}, this._frameDuration);
	}

	tick() {
		this._bgDistance += this._bgSpeed;

		if (this._bgDistance % this._pipeSpawnInterval === 0) {
			this._pipes.push(
				new Pipe(
					this._bgDistance + this._canvas.width,
					this._canvas.height,
					SpriteMap.sprites.pipetop.image,
					SpriteMap.sprites.pipebottom.image
				)
			);
		}

		for (let i = 0; i < this._pipes.length; i++) {
			const pipe = this._pipes[i];
			this._pipes[i].bgOffset = this._bgDistance;
			if (pipe.x + pipe.width - this._bgDistance < 0)
				this._pipes.splice(i, 1);
		}

		this.draw();
	}

	draw() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		for (
			let i = 0;
			i <
			Math.ceil(
				this._canvas.width / SpriteMap.sprites.background.image.width
			) +
				1;
			i++
		) {
			this._ctx.drawImage(
				SpriteMap.sprites.background.image,
				i * SpriteMap.sprites.background.image.width -
					Math.floor(
						this._bgDistance %
							SpriteMap.sprites.background.image.width
					),
				0
			);
		}

		for (const p of this._pipes) {
			p.draw(this._ctx);
		}

		let p = new Pipe(
			0,
			50,
			SpriteMap.sprites.pipetop.image,
			SpriteMap.sprites.pipebottom.image
		);
		p.draw(this._ctx);
	}
}
