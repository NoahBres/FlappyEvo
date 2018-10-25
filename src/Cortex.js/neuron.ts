export default class Neuron {
	private _value = 0;
	private _weights: Array<number> = [];

	constructor(weightLength: number = 0) {
		for (let i = 0; i < weightLength; i++) this._weights.push(0);
	}

	randomize(weightLength: number) {
		this._weights = [];

		for (let i = 0; i < weightLength; i++)
			this._weights.push(Neuron.randomClamped());
	}

	private static randomClamped(): number {
		return Math.random() * 2 - 1;
	}

	get value(): number {
		return this._value;
	}

	set value(value: number) {
		this._value = value;
	}

	get weights(): Array<number> {
		return this._weights;
	}

	set weights(weights: Array<number>) {
		this._weights = weights;
	}
}
