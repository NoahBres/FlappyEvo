console.log("Test");

import Cortex from "./Cerebrum.js/cerebrum";
<<<<<<< HEAD
import Darwin from "./Darwin.js/darwin";

let cc = new Cortex(2, [2], 1);
console.log(cc.compute([0.5, 0.7]));
=======

let cc = new Cortex(2, [2], 1);
console.log(cc.compute());
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5

import Game from "./game/game";

function start() {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
<<<<<<< HEAD

	const darwin = new Darwin(50);
	const game = new Game(canvas, darwin);
=======
	const game = new Game(canvas);
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
	game.init();
}

start();
