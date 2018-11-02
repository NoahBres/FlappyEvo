import Layer from "./layer";
import CerebrumData from "./cerebrum_data";

export default class Cerebrum {
	private _layers: Array<Layer> = [];

	constructor(
		inputsLength: number,
		hiddenLength: number[],
		outputLength: number
	) {
		const inputLayer = new Layer().randomize(inputsLength, 0);
		this._layers.push(inputLayer);

		let previousLayerSize = inputsLength;
		for (let i in hiddenLength) {
			const layer = new Layer().randomize(
				hiddenLength[i],
				previousLayerSize
			);
			previousLayerSize = hiddenLength[i];
			this._layers.push(layer);
		}

		const outputLayer = new Layer().randomize(
			outputLength,
			previousLayerSize
		);
		this._layers.push(outputLayer);
	}

	export(): CerebrumData {
		const data: CerebrumData = {
			neuronsInLayer: [],
			neuronWeights: []
		};

		for (let i in this._layers) {
			data.neuronsInLayer.push(this._layers[i].neurons.length);
			for (let j in this._layers[i].neurons) {
				for (let k in this._layers[i].neurons[j].weights) {
					data.neuronWeights.push(this._layers[i].neurons[j].weights[k]);
				}
			}
		}

		return data;
	}

	import(data: CerebrumData) {
		this._layers = [];

		let previousNeurons = 0;
		let indexWeights = 0;
		const layers: Array<Layer> = [];

		for (const i in data.neuronsInLayer) {
			const layer = new Layer().randomize(
				data.neuronsInLayer[i],
				previousNeurons
			);

			for (let j in layer.neurons) {
				for (let k in layer.neurons[j].weights) {
					layer.neurons[j].weights[k] = data.weights[indexWeights++];
				}
			}

			previousNeurons = data.neuronsInLayer[i];
			this._layers.push(layer);
		}
	}

	compute(inputs: number[]): Array<number> {
		for (const i in inputs) {
			if (this._layers[0] && this._layers[0].neurons[i])
				this._layers[0].neurons[i].value = inputs[i];
		}

		let previousLayer = this._layers[0];
		for (let i = 1; i < this._layers.length; i++) {
			for (const j in this._layers[i].neurons) {
				let sum = 0;

				for (const k in previousLayer.neurons)
					sum +=
						previousLayer.neurons[k].value *
						this._layers[i].neurons[j].weights[k];

				this._layers[i].neurons[j].value = this.activate(sum);
			}

			previousLayer = this._layers[i];
		}

		const output: Array<number> = [];
		const lastLayer = this._layers[this._layers.length - 1];
		for (let i in lastLayer.neurons)
			output.push(lastLayer.neurons[i].value);

		return output;
	}

	activate(i: number): number {
		return 1 / (1 + Math.exp(-i));
	}

	set layers(layers: Array<Layer>) {
		this._layers = layers;
	}

	get layers(): Array<Layer> {
		return this._layers;
	}
}
