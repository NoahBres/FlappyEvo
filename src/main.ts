console.log("Test");

import Cortex from "./Cerebrum.js/cerebrum";
// import Darwin from "./Darwin.js/darwin";
// import NumberChromosome from './Darwin.js/chromosomes/number_chromosome';
import { NumberChromosome } from "darwinjs";
import { RankSelect } from "darwinjs";
import { UniformCross } from "darwinjs";
import { AdditionMutate } from "darwinjs";

import { Darwin } from "darwinjs";

let cc = new Cortex(2, [2], 1);
console.log(cc.compute([0.5, 0.7]));

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
  game.init();
}

start();
