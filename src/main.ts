import { Heredity } from "heredity";
import { NeuralChromosome } from "heredity";
import { Mutation, Crossover, Selection } from "heredity";

import { DnaViz, PerceptronViz } from "heredity";

import Game from "./game/game";

function start() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const heredity = new Heredity({
    populationSize: 50,
    templateChromosome: new NeuralChromosome(
      {
        inputLength: 2,
        hiddenLength: [2],
        outputLength: 1,
        activation: NeuralChromosome.sigmoid
      },
      6
    ),
    mutationRate: 0.3,
    selection: Selection.topSelect,
    crossover: Crossover.uniformCross,
    mutation: Mutation.additionMutate
  });

  const dnaViz = new DnaViz(
    document.getElementById("dna-viz-section"),
    heredity
  );

  const perceptronViz = new PerceptronViz(
    document.getElementById("perceptron-viz-section"),
    heredity,
    {
      index: 0,
      threshhold: i => i > 0.5
    }
  );

  perceptronViz.link(dnaViz);

  const game = new Game(canvas, heredity, dnaViz);

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

  pauseBtn.addEventListener("click", () => {
    const value = pauseBtn.value;

    let paused = value == "paused" ? true : false;
    let text = !paused ? "❚❚ Pause" : "▶ Resume";
    pauseBtn.value = !paused ? "paused" : "unpaused";
    pauseBtn.innerHTML = text;
    pauseBtn.className = !paused ? "action-btn" : "action-btn paused";

    game.pause(!paused);
  });

  document.getElementById("killall-btn").addEventListener("click", () => {
    game.killAll();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    game.reset();
  });

  game.init();
}

start();
