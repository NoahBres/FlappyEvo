import preload from "./preload";

<<<<<<< HEAD
export default class SpriteMap {
	private static _sprites = {
		bird: { image: null, url: "./img/bird.png" },
		bird_red: { image: null, url: "./img/birdred.png" },
=======
interface Sprite {
	{}
}

export default class SpriteMap {
	private static _sprites = {
		bird: { image: null, url: "./img/bird.png" },
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
		background: { image: null, url: "./img/background.png " },
		pipetop: { image: null, url: "./img/pipetop.png" },
		pipebottom: { image: null, url: "./img/pipebottom.png" }
	};

	static loadSprites(): Promise<any> {
		return new Promise((resolve, reject) => {
			Promise.all<HTMLImageElement>([
				preload(this._sprites.bird.url),
<<<<<<< HEAD
				preload(this._sprites.bird_red.url),
=======
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
				preload(this._sprites.background.url),
				preload(this._sprites.pipetop.url),
				preload(this._sprites.pipebottom.url)
			]).then(image => {
<<<<<<< HEAD
				let i = 0;
				this._sprites.bird.image = image[i++];
				(this._sprites.bird_red.image = image[i++]),
					(this._sprites.background.image = image[i++]),
					(this._sprites.pipetop.image = image[i++]),
					(this._sprites.pipebottom.image = image[i++]);

				i = 0;

				resolve({
					bird: image[i++],
					bird_red: image[i++],
					background: image[i++],
					pipetop: image[i++],
					pipebottom: image[i++]
=======
				this._sprites.bird.image = image[0];
				this._sprites.background.image = image[1],
				this._sprites.pipetop.image = image[2],
				this._sprites.pipebottom.image = image[3]
				resolve({
					bird: image[0],
					background: image[1],
					pipetop: image[2],
					pipebottom: image[3]
>>>>>>> d874d296bda771a855db52a9fa4e0ed28d0113c5
				});
			});
		});
	}

	static get sprites() {
		return this._sprites;
	}
}
