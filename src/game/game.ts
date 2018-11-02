import SpriteMap from "./sprite_map";
import Pipe from "./pipe";
<<<<<<< HEAD
import Bird from "./bird";

import Darwin from "../Darwin.js/darwin";
import Cerebrum from "../Cerebrum.js/cerebrum";

export default class Game {
  private _imgsLoaded = false;

  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  // Duration of frame
  private _fps = 60; //1000 / (60 * 1);
  // Offset of background
  private _bgDistance = 0;
  // Background speed
  private _bgSpeed = 2;

  private _pipeSpeed = 3;

  // New pipe spawn interval
  private _pipeSpawnInterval = 240;
  // Generated pipes
  private _pipes: Array<Pipe> = [];

  private _birds: Array<Bird> = [];
  private _birdInitialX = 80;

  private _darwin: Darwin;

  constructor(canvas: HTMLCanvasElement, darwin: Darwin) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
    this._darwin = darwin;
  }

  init() {
    if (!this._imgsLoaded) {
      SpriteMap.loadSprites().then(images => {
        this._imgsLoaded = true;

        // Load birds
        for (let i = 0; i < this._darwin.populationSize; i++) {
          this._birds.push(
            new Bird(
              this._birdInitialX,
              this._canvas.height / 2,
              this._canvas.height - 25,
              this._pipeSpeed,
              SpriteMap.sprites.bird.image,
              SpriteMap.sprites.bird_red.image,
              new Cerebrum(2, [2], 2)
            )
          );
        }

        this.tick();
        this.draw();
      });
    }
  }

  restart() {
    for (const b of this._birds) {
      b.x = 80;
      b.y = this._canvas.height / 2;
      b.alive = true;
    }

    console.log("restart");
  }

  tick() {
    this._bgDistance += this._bgSpeed;

    // Pipe logic
    if (this._bgDistance % this._pipeSpawnInterval === 0) {
      this._pipes.push(
        new Pipe(
          this._canvas.width,
          this._canvas.height,
          this._pipeSpeed,
          SpriteMap.sprites.pipetop.image,
          SpriteMap.sprites.pipebottom.image
        )
      );
    }

    for (let i = 0; i < this._pipes.length; i++) {
      const pipe = this._pipes[i];
      pipe.tick();
      if (pipe.x + pipe.width < 0) this._pipes.splice(i, 1);
    }

    let nextPipeHeight = this._canvas.height / 2;
    for (let i = 0; i < this._pipes.length; i++) {
      if (this._pipes[i].x + this._pipes[i].width > this._birdInitialX) {
        nextPipeHeight = this._pipes[i].y;
        break;
      }
    }

    // Bird logic
    for (let i = 0; i < this._birds.length; i++) {
      const b = this._birds[i];
      b.tick();
      if (!b.alive) continue;

      const output = b.brain.compute([
        b.y / this._canvas.height,
        nextPipeHeight / this._canvas.height
      ]);

      if (output[0] > 0.5) b.flap();
    }

    // if (Math.random() < 0.9)
    // 	this._birds[Math.floor(this._birds.length * Math.random())].flap();

    if (this._birds.every(b => b.alive == false)) this.restart();

    if (this._fps == 0) this.tick();
    else {
      setTimeout(() => {
        this.tick();
      }, 1000 / this._fps);
    }
  }

  draw() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (
      let i = 0;
      i <
      Math.ceil(this._canvas.width / SpriteMap.sprites.background.image.width) +
        1;
      i++
    ) {
      this._ctx.drawImage(
        SpriteMap.sprites.background.image,
        i * SpriteMap.sprites.background.image.width -
          Math.floor(
            this._bgDistance % SpriteMap.sprites.background.image.width
          ),
        0
      );
    }

    for (let i = 0; i < this._birds.length; i++) {
      this._birds[i].draw(this._ctx);
    }

    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i].draw(this._ctx);
    }

    requestAnimationFrame(() => {
      this.draw();
    });
  }
=======

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
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
}
