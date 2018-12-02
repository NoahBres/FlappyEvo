import { NumberChromosome } from "darwinjs";
import { RankSelect } from "darwinjs";
import { UniformCross } from "darwinjs";
import { AdditionMutate } from "darwinjs";

import { Darwin } from "darwinjs";

import Game from "./game/game";

function start() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const darwin = new Darwin({
    populationSize: 50,
    templateChromosome: new NumberChromosome(
      {
        lowerBound: -1,
        upperBound: 1
      },
      9
    ),
    selection: RankSelect,
    crossover: UniformCross,
    mutation: AdditionMutate
  });
  const game = new Game(canvas, darwin);

  const speedBtns = document.querySelectorAll('input[name="speed-choice"]');
  speedBtns.forEach(x => {
    x.addEventListener("change", e => {
      e = e || window.event;
      const target = <HTMLInputElement>(e.target || e.srcElement);
      const value = Number(target.value);
      e.stopImmediatePropagation();
      game.setFPS(60 * value);
    });
  });

  const pauseBtn = <HTMLButtonElement>document.getElementById("pause-btn");

  pauseBtn.addEventListener("click", e => {
    const value = pauseBtn.value;

    let paused = value == "paused" ? true : false;
    let text = !paused ? "❚❚ Pause" : "▶ Resume";
    pauseBtn.value = !paused ? "paused" : "unpaused";
    pauseBtn.innerHTML = text;
    pauseBtn.className = !paused ? "" : "paused";

    game.pause(!paused);
  });

  game.init();
}

start();
