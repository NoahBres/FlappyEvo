import GenericChromosome from "./chromosomes/generic_chromosome";

export default class Population {
	private _chromosomes: GenericChromosome<any>[] = [];
	private _size: number = 0;

	constructor(size: number, chromosomes: GenericChromosome<any>[] = []) {
		this._chromosomes = chromosomes;
		this._size = size;
	}

	generate(templateChromosome: GenericChromosome<any>): Population {
		this._chromosomes = [];

		for(let i = 0; i < this._size; i++) {
			let c = templateChromosome.duplicate();
				c.generate();

			this._chromosomes.push(c.duplicate());
		}

		return this;
	}

	topChromosome() {
		let top = this._chromosomes[0].fitness;
		
		let index;
		for(index = 0; index < this._chromosomes.length; index++) {
			let val = this._chromosomes[index].fitness;
			top = val > top ? val : top;
		}

		return {
			index: index,
			fitness: this._chromosomes[index].fitness,
			chromosome: this._chromosomes[index]
		}
	}

	lowestChromosome() {
		let low = this._chromosomes[0].fitness;
		
		let index;
		for(index = 0; index < this._chromosomes.length; index++) {
			let val = this._chromosomes[index].fitness;
			low = val < low ? val : low;
		}

		return {
			index: index,
			fitness: this._chromosomes[index].fitness,
			chromosome: this._chromosomes[index]
		}
	}

	sort() {
		// Sort descending. Highest fitness is in position 0
		this._chromosomes.sort((a, b) => b.fitness - a.fitness);
	}

	getGenes(): number[] {
		let data = [];
		for(const chromosome of this._chromosomes) {
			data.push(chromosome.genes);
		}

		return data;
	}

	getGenesFlat(): number[] {
		let data = [];
		for(const chromosome of this._chromosomes) {
			data = [...data, ...chromosome.genes];
		}

		return data;
	}
}
