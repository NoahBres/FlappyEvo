import Genome from "./genome";

export default class Generation {
	private _genomes: Array<Genome> = [];

	private _population: number;
	private _elitism: number;
	private _randomBehaviour: number;
	private _nbChild: number;
	private _mutationRange: number;
	private _mutationRate: number;

	constructor({
		population = 50,
		elitism = 0.1,
		mutationRate = 0.2,
		mutationRange = 0.5
	}) {}
}
