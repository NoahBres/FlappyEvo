console.log("Test");

import Cortex from "./Cerebrum.js/cerebrum";
import Darwin from "./Darwin.js/darwin";

let cc = new Cortex(2, [2], 1);
console.log(cc.compute([0.5, 0.7]));

import Game from "./game/game";

function start() {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;

	const darwin = new Darwin(50);
	const game = new Game(canvas, darwin);
	game.init();
}

start();
