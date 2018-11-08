import GenericChromosome from "./chromosomes/generic_chromosome";

export default class Population {
	private _chromosomes: GenericChromosome<any>[] = [];

	constructor(chromosomes: GenericChromosome<any>[]) {
		this._chromosomes = chromosomes;
	}

	generate(templateChromosome: GenericChromosome<any>, params): Population {
		return this;
	}
}
