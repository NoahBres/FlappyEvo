import preload from "./preload";

import bird_path from "../../img/bird.png";
import bird_red_path from "../../img/birdred.png";
import background_path from "../../img/background.png";
import pipetop_path from "../../img/pipetop.png";
import pipebottom_path from "../../img/pipebottom.png";

export default class SpriteMap {
	private static _sprites = {
		bird: { image: null, url: bird_path },//"./img/bird.png" },
		bird_red: { image: null, url: bird_red_path},//"./img/birdred.png" },
		background: { image: null, url: background_path},//"./img/background.png " },
		pipetop: { image: null, url: pipetop_path},//"./img/pipetop.png" },
		pipebottom: { image: null, url: pipebottom_path},//"./img/pipebottom.png" }
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
