import preload from "./preload";

interface Sprite {
	{}
}

export default class SpriteMap {
	private static _sprites = {
		bird: { image: null, url: "./img/bird.png" },
		background: { image: null, url: "./img/background.png " },
		pipetop: { image: null, url: "./img/pipetop.png" },
		pipebottom: { image: null, url: "./img/pipebottom.png" }
	};

	static loadSprites(): Promise<any> {
		return new Promise((resolve, reject) => {
			Promise.all<HTMLImageElement>([
				preload(this._sprites.bird.url),
				preload(this._sprites.background.url),
				preload(this._sprites.pipetop.url),
				preload(this._sprites.pipebottom.url)
			]).then(image => {
				this._sprites.bird.image = image[0];
				this._sprites.background.image = image[1],
				this._sprites.pipetop.image = image[2],
				this._sprites.pipebottom.image = image[3]
				resolve({
					bird: image[0],
					background: image[1],
					pipetop: image[2],
					pipebottom: image[3]
				});
			});
		});
	}

	static get sprites() {
		return this._sprites;
	}
}
