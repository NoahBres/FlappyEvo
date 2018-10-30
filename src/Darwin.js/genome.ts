export default class Genome {
	private _fitness: number;
	private _data: any[];

	constructor(score: number, data: any[]) {
		this._fitness = score;
		this._data = data;
	}

	get fitness(): number {
		return this._fitness;
	}

	set fitness(fitness: number) {
		this._fitness = fitness;
	}

	get data(): any[] {
		return this._data;
	}

	set data(data: any[]) {
		this._data = data;
	}
}
