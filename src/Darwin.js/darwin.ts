export default class Darwin {
	private _populationSize: number;

	constructor(populationSize: number) {
		this._populationSize = populationSize;
	}

	get populationSize(): number {
		return this._populationSize;
	}
}
