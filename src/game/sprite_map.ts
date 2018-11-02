import preload from "./preload";

export default class SpriteMap {
	private static _sprites = {
		bird: { image: null, url: "./img/bird.png" },
		bird_red: { image: null, url: "./img/birdred.png" },
		background: { image: null, url: "./img/background.png " },
		pipetop: { image: null, url: "./img/pipetop.png" },
		pipebottom: { image: null, url: "./img/pipebottom.png" }
	};

	static loadSprites(): Promise<any> {
		return new Promise((resolve, reject) => {
			Promise.all<HTMLImageElement>([
				preload(this._sprites.bird.url),
				preload(this._sprites.bird_red.url),
				preload(this._sprites.background.url),
				preload(this._sprites.pipetop.url),
				preload(this._sprites.pipebottom.url)
			]).then(image => {
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
				});
			});
		});
	}

	static get sprites() {
		return this._sprites;
	}
}
