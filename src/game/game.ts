import { Darwin } from "darwinjs";

import SpriteMap from "./sprite_map";
import Pipe from "./pipe";
import Bird from "./bird";
import Cerebrum from "../Cerebrum.js/cerebrum";
import { timingSafeEqual } from "crypto";

export default class Game {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  private _darwin: Darwin;

  private _fps = 60;
  private _imgsLoaded = false;

  private _bgSpeed = 0.5;
  private _bgOffsetX = 0;

  private _pipes: Pipe[] = [];
  private _pipeSpawnInterval = 120;
  private _currPipeSpawnInterval = 0;
  private _pipeYPadding = 30;
  private _pipeOpening = 120;
  private _pipeSpeed = 3;

  private _birds: Bird[] = [];
  private _birdInitialX = 80;
  private _birdYBoundary: number;

  private _gameScore = 0;
  private _highScore = 0;
  private _alive = 0;
  private _pipeCount = 0;

  private _running = false;

  constructor(canvas: HTMLCanvasElement, darwin: Darwin) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
    this._darwin = darwin;

    this._birdYBoundary = this._canvas.height - 25;
  }

  init() {
    if (!this._imgsLoaded) {
      SpriteMap.loadSprites().then(images => {
        this._imgsLoaded = true;

        this._darwin.generatePopulation();

        const newGenes = this._darwin.population.getGenes();
        for (let i = 0; i < this._darwin.population.size; i++) {
          const c = new Cerebrum(2, [2], 1, Cerebrum.prototype.sigmoid);
          c.setWeights(newGenes[i]);
          this._birds.push(
            new Bird(
              this._birdInitialX,
              this._canvas.height / 2,
              this._birdYBoundary,
              this._pipeSpeed,
              SpriteMap.sprites.bird.image,
              SpriteMap.sprites.bird_red.image,
              c
            )
          );
        }

        this._running = true;

        this.tick();
        this.draw();
      });
    }
  }

  restart() {
    this._pipes = [];

    this._gameScore = 0;
    this._pipeCount = 0;

    this._darwin.setFitness(this._birds.map(x => x.score));
    // console.log(this._birds.map(x => x.score));
    this._darwin.nextGeneration();

    const newGenes = this._darwin.population.getGenes();

    for (const i in this._birds) {
      const b = this._birds[i];
      b.x = 80;
      b.y = this._canvas.height / 2;
      b.alive = true;

      let c = new Cerebrum(2, [2], 1, Cerebrum.prototype.sigmoid);
      // debugger;
      c.setWeights(newGenes[i]);
      // console.log(newGenes[i]);
      // console.log(c.getWeights());
      // console.log(i);

      b.brain = c; //new Cerebrum(2, [2], 2, Cerebrum.prototype.sigmoid);
    }
  }

  tick() {
    this._bgOffsetX += this._bgSpeed;

    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i].tick();
      if (this._pipes[i].x + this._pipes[i].width < 0) this._pipes.splice(i, 1);
    }

    // Pipe spawning
    if (
      this._currPipeSpawnInterval == this._pipeSpawnInterval ||
      this._pipes.length == 0
    ) {
      let constrainedHeight =
        this._canvas.height - this._pipeYPadding * 2 - this._pipeOpening / 2;
      let yOffset = (this._canvas.height - constrainedHeight) / 2;
      let middleY = Math.round(Math.random() * constrainedHeight) + yOffset;

      this._pipes.push(
        new Pipe({
          x: this._canvas.width,
          middleY: middleY,
          openingSize: this._pipeOpening,
          pipeSpeed: this._pipeSpeed,
          topPipe: SpriteMap.sprites.pipetop.image,
          bottomPipe: SpriteMap.sprites.pipebottom.image
        })
      );

      this._pipeCount++;

      this._currPipeSpawnInterval = 0;
    }

    // Pipe spawning
    this._currPipeSpawnInterval++;

    let nextPipe: Pipe;
    for (let i = 0; i < this._pipes.length; i++) {
      if (this._birds.length <= 0) break;

      if (this._pipes[i].x + this._pipes[i].width > this._birds[0].x) {
        nextPipe = this._pipes[i];
        break;
      }
    }

    for (let i = 0; i < this._birds.length; i++) {
      const b = this._birds[i];
      b.tick();
      if (!b.alive) continue;

      // const inputs = [
      //   b.y / this._canvas.height,
      //   nextPipe.y / this._canvas.height
      // ]
      const inputs = [
        (b.y - nextPipe.y) / (this._canvas.height / 2),
        (b.x - nextPipe.x) / this._canvas.width
      ];

      const output = b.brain.compute(inputs);

      if (output[0] > 0.5) b.flap();

      for (let j = 0; j < this._pipes.length; j++) {
        if (
          this._pipes[j].hitMe(b.x, b.y, b.width, b.height) ||
          b.y > this._birdYBoundary
        ) {
          let score = b.y + b.height / 2 - this._pipes[j].y;

          b.kill(this._gameScore);
        }
      }
    }

    this._gameScore++;
    this._highScore = Math.max(this._gameScore, this._highScore);

    if (this._birds.every(b => !b.alive)) this.restart();

    if (!this._running) return;

    if (this._fps == 0) this.tick();
    else {
      setTimeout(() => {
        this.tick();
      }, 1000 / this._fps);
    }
  }

  draw() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    const bgSprite = SpriteMap.sprites.background.image;
    for (
      let i = 0;
      i < Math.ceil(this._canvas.width / bgSprite.width) + 1;
      i++
    ) {
      this._ctx.drawImage(
        bgSprite,
        i * bgSprite.width - Math.floor(this._bgOffsetX % bgSprite.width),
        0
      );
    }

    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i].draw(this._ctx);
    }

    for (let i = 0; i < this._birds.length; i++) {
      this._birds[i].draw(this._ctx);
    }

    this._ctx.font = "15px Arial";
    this._ctx.fillText(`Score: ${this._gameScore}`, 10, 20);
    this._ctx.fillText(`High Score: ${this._highScore}`, 10, 40);
    this._ctx.fillText(`Pipes: ${this._pipeCount}`, 10, 60);
    this._ctx.fillText(`Generation: ${this._darwin.history.length}`, 10, 80);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  setFPS(fps: number) {
    this._fps = fps;
  }

  pause(pause: boolean) {
    this._running = pause;

    if(this._running) this.tick(;)
  }
}
