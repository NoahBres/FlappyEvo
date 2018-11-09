import GenericChromosome from "./chromosomes/generic_chromosome";
import Population from "./population";

export default class Darwin {
	private _populationSize: number;
	private _templateChromosome: GenericChromosome<any>;
	private _mutationRate: number;
	private _mutationRange: number;
	private _crossoverRate: number;
	private _elitism: number;
	private _newChromosomes: number;

	private _history: Population[] = [];

	private _population: Population;

	constructor({ 
			populationSize = 50,
			templateChromosome,
			mutationRate = 0.2,
			mutationRange = 0.5,
			crossoverRate = 0.9,
			elitism = 0.1,
			newChromosomes = 0.1
		}: ConstructorOptions) {
		
		this._populationSize = populationSize;
		this._templateChromosome = templateChromosome;
		this._mutationRate = mutationRate;
		this._mutationRange = mutationRange;
		this._crossoverRate = crossoverRate;
		this._elitism = elitism;
		this._newChromosomes = newChromosomes;
	}

	newPopulation(): Darwin {
		let pop = new Population(this._populationSize);
			pop.generate(this._templateChromosome.duplicate());
		this._population = pop;
		return this;
	}

	nextGeneration(): Darwin {
		
		
		return this;
	}

	get populationSize(): number {
		return this._populationSize;
	}

	get population(): Population {
		return this._population;
	}

	set population(pop: Population) {
		this._population = pop;
	}
}

interface ConstructorOptions {
	populationSize: number,
	templateChromosome: GenericChromosome<any>,
	mutationRate?: number,
	mutationRange?: number,
	crossoverRate?: number,
	elitism?: number,
	newChromosomes?: number,
};