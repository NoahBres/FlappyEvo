import Neuron from "./neuron";

export default class Layer {
	private _neurons: Array<Neuron> = [];

	constructor(neurons: Array<Neuron> = []) {
		this._neurons = neurons;
	}

	randomize(neuronsLength: number, inputsLength: number) {
		for (let i = 0; i < neuronsLength; i++) {
			const neuron = new Neuron().randomize(inputsLength);
			this._neurons.push(neuron);
		}

		return this;
	}

	set neurons(neurons: Array<Neuron>) {
		this._neurons = neurons;
	}

	get neurons(): Array<Neuron> {
		return this._neurons;
	}
}
