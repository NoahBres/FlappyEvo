console.log("Test");

import Cortex from "./Cerebrum.js/cerebrum";

let cc = new Cortex(2, [2], 1);
console.log(cc.compute());

import Game from "./game/game";

function start() {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const game = new Game(canvas);
	game.init();
}

start();
