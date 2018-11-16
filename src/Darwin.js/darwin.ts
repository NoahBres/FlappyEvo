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

	private _selection: (chromosomes: GenericChromosome<any>[], num: number) => GenericChromosome<any>[];

	private _history: Population[] = [];

	private _population: Population;

	constructor({ 
			populationSize = 50,
			templateChromosome,
			mutationRate = 0.2,
			mutationRange = 0.5,
			crossoverRate = 0.9,
			elitism = 0.1,
			newChromosomes = 0.1,
			selection = Darwin.selection.RouletteWheel
		}: ConstructorOptions) {
		
		this._populationSize = populationSize;
		this._templateChromosome = templateChromosome;
		this._mutationRate = mutationRate;
		this._mutationRange = mutationRange;
		this._crossoverRate = crossoverRate;
		this._elitism = elitism;
		this._newChromosomes = newChromosomes;
		this._selection = selection;
	}

	newPopulation(): Darwin {
		let pop = new Population(this._populationSize);
			pop.generate(this._templateChromosome.duplicate());
		this._population = pop;
		return this;
	}

	nextGeneration(): Darwin {
		this._population.sort();

		this._history.push(this._population.duplicate());

		let elitistCount = Math.floor(this._elitism * this._population.size);
		let freshCount = Math.floor(this._newChromosomes * this._population.size);
		let operationCount = this._population.size - (elitistCount + freshCount);
		let crossCount = Math.round(operationCount * this._crossoverRate);
			crossCount = (crossCount % 2) == 0 ? crossCount : crossCount - 1;
		let plebCount = operationCount - crossCount;

		console.log({ elitistCount, freshCount, operationCount, crossCount, plebCount });

		let totalChromosomes = [];
		let elitistChromosomes = [];
		let freshChromosomes = [];
		let crossedChromosomes = [];
		let plebChromosomes = [];

		for(let i = 0; i < elitistCount; i++) {
			elitistChromosomes.push(this._population.chromosomes[i]);
		}

		let fresh = new Population(freshCount);
			fresh.generate(this._templateChromosome.duplicate())
		freshChromosomes = fresh.chromosomes;

		const toBeCrossed = this._selection.apply(this, [this._population, crossCount]);

		totalChromosomes = [...elitistChromosomes, ...freshChromosomes, ...crossedChromosomes, ...plebChromosomes];

		console.log(totalChromosomes);

		debugger;

		return this;
	}

	setFitness(scores: number[]) {
		this._population.setFitness(scores);
	}

	get population(): Population {
		return this._population;
	}

	set population(pop: Population) {
		this._population = pop;
	}

	static selection = {
		RouletteWheel(chromosomes: GenericChromosome<any>[], num: number): GenericChromosome<any>[] {
			let selections = [];

			let totalFitness = chromosomes.reduce((acc, curr) => acc + curr.fitness, 0);
	
			while(selections.length < num) {
				let goal = Math.random() * totalFitness;

				let sum = 0;
				for(let j = 0; j < chromosomes.length; j++) {
					sum += chromosomes[j].fitness;

					if(sum >= goal) {
						selections.push(chromosomes[j].duplicate());
						break;
					}
				}
			}

			return selections;
		},

		Rank(chromosomes: GenericChromosome<any>[], num: number): GenericChromosome<any>[] {
			let selections = [];

			let totalRank = 0;
			for(let i = 0; i < chromosomes.length; i++) {
				totalRank += chromosomes.length - i;
			}

			while(selections.length < num) {
				let goal = Math.random() * totalRank;

				let sum = 0;
				for(let j = 0; j < chromosomes.length; j++) {
					sum += chromosomes.length - j;

					if(sum >= goal) {
						selections.push(chromosomes[j].duplicate());
						break;
					}
				}
			}
			
			return chromosomes;
		},

		Top(chromosomes: GenericChromosome<any>[], num: number): GenericChromosome<any>[] {
			let selections = [];

			for(let i = 0; i < num; i++) {
				selections.push(chromosomes[i].duplicate());
			}

			return selections;
		},

		Random(chromosomes: GenericChromosome<any>[], num: number): GenericChromosome<any>[] {
			let selections = [];

			for(let i = 0; i < num; i++) {
				let random = Math.floor(Math.random() * chromosomes.length);
				selections.push(chromosomes[random].duplicate());
			}

			return selections;
		}
	}

	static crossover = {
		SinglePoint(parent1: GenericChromosome<any>, parent2: GenericChromosome<any>): GenericChromosome<any>[] {
			let child1 = parent1.duplicate();
			let child2 = parent2.duplicate();
			
			return [];
		}
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

	selection?: (chromosomes: GenericChromosome<any>[], num: number) => GenericChromosome<any>[]
};