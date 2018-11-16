import SpriteMap from "./sprite_map";
import Pipe from "./pipe";
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
  private _birdYBoundary: number;

  private _totalScore = 0;

  private _darwin: Darwin;

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

        this._darwin.newPopulation();

        const newGenes = this._darwin.population.getGenes();

        // Load birds
        for (let i = 0; i < this._darwin.populationSize; i++) {
          let c = new Cerebrum(2, [2], 2, Cerebrum.prototype.sigmoid)
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


        this.tick();
        this.draw();
      });
    }
  }

  restart() {
    this._pipes = [];

    this._darwin.setFitness(this._birds.map(x => x.score));
    this._darwin.nextGeneration();
    
    for (const b of this._birds) {
      b.x = 80;
      b.y = this._canvas.height / 2;
      b.alive = true;
      const newGenes = this._darwin.population.getGenes();

      let c = new Cerebrum(2, [2], 2, Cerebrum.prototype.sigmoid)
      // c.setWeights(newGenes[i]);
      // console.log(newGenes[i]);
      // console.log(c.getWeights());
      // console.log(i);

      b.brain = c;//new Cerebrum(2, [2], 2, Cerebrum.prototype.sigmoid);
    }

    this._totalScore = 0;
    console.log("restart");
  }

  tick() {
    this._bgDistance += this._bgSpeed;
    this._totalScore++;

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

      // Check if hit pipe
      for(let j = 0; j < this._pipes.length; j++) {
        const p = this._pipes[j];
        if(
          (
            b.x + b.width > p.x &&
            b.y < p.y - p.opening &&
            b.x + b.width < p.x + p.width
          ) || (
            b.x + b.width > p.x &&
            b.x + b.width < p.x + p.width &&
            b.y + b.height > p.y
          ) || (
           b.y > this._birdYBoundary 
          )
        ) {
          b.kill(this._totalScore);
        }
      }
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
}
