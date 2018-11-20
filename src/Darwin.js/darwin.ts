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
	private _crossover: (parent1: GenericChromosome<any>, parent2: GenericChromosome<any>) => GenericChromosome<any>[];
	private _mutation: (chromosomes: GenericChromosome<number>[], chance: number, mutationRange: number) => GenericChromosome<any>[]

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
			selection = Darwin.selection.RouletteWheel,
			crossover = Darwin.crossover.SinglePoint,
			mutation = Darwin.mutations.Addition
		}: ConstructorOptions) {
		
		this._populationSize = populationSize;
		this._templateChromosome = templateChromosome;
		this._mutationRate = mutationRate;
		this._mutationRange = mutationRange;
		this._crossoverRate = crossoverRate;
		this._elitism = elitism;
		this._newChromosomes = newChromosomes;
		this._selection = selection;
		this._crossover = crossover;
		this._mutation = mutation;
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

		const toBeCrossed = this._selection.apply(this, [this._population.chromosomes, crossCount]);

		for(let i = 0; i < toBeCrossed.length; i += 2) {
			let children = this._crossover.apply(this, [toBeCrossed[i].duplicate(), toBeCrossed[i + 1].duplicate()]);
			crossedChromosomes.push(children[0]);
			crossedChromosomes.push(children[1]);
		}

		plebChromosomes = this._selection.apply(this, [this._population.chromosomes, plebCount]);

		totalChromosomes = [...elitistChromosomes, ...freshChromosomes, ...crossedChromosomes, ...plebChromosomes];

		totalChromosomes = this._mutation.apply(this, [totalChromosomes, this._mutationRate, this._mutationRange]);
		
		console.log(totalChromosomes);

		//debugger;

		this._population = new Population(totalChromosomes.length, totalChromosomes);

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

			let crossoverPoint = Math.floor(Math.random() * parent1.genes.length);

			child1.genes = [...parent1.genes.slice(0, crossoverPoint), ...parent2.genes.slice(crossoverPoint)]
			child2.genes = [...parent2.genes.slice(0, crossoverPoint), ...parent1.genes.slice(crossoverPoint)]
			
			return [child1, child2];
		},

		TwoPoint(parent1: GenericChromosome<any>, parent2: GenericChromosome<any>): GenericChromosome<any>[] {
			let child1 = parent1.duplicate();
			let child2 = parent2.duplicate();

			let crossoverPoint1 = Math.floor(Math.random() * parent1.genes.length);
			let crossoverPoint2 = Math.floor(Math.random() * parent2.genes.length);

			if(crossoverPoint1 > crossoverPoint2)
				[crossoverPoint1, crossoverPoint2] = [crossoverPoint2, crossoverPoint1];

			child1.genes = [...parent1.genes.slice(0, crossoverPoint1), ...parent2.genes.slice(crossoverPoint1, crossoverPoint2 - crossoverPoint1), ...parent1.genes.slice(crossoverPoint2)]
			child2.genes = [...parent2.genes.slice(0, crossoverPoint1), ...parent1.genes.slice(crossoverPoint1, crossoverPoint2 - crossoverPoint1), ...parent2.genes.slice(crossoverPoint2)]
			
			return [child1, child2];
		}
	}

	static mutations = {
		Addition(chromosomes: GenericChromosome<number>[], chance: number, mutationRange: number): GenericChromosome<any>[] {
			for(let i = 0; i < chromosomes.length; i++) {
				for(let j = 0; j < chromosomes[i].genes.length; j++) {
					let rand = Math.random();

					if(rand <= chance) {
						let genes = chromosomes[i].genes;
						let randPlus = Math.random() * mutationRange * 2 - mutationRange;

						genes[j] += randPlus;

						chromosomes[i].genes = genes;
					}
				}
			}

			return chromosomes;
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

	selection?: (chromosomes: GenericChromosome<any>[], num: number) => GenericChromosome<any>[],
	crossover?: (parent1: GenericChromosome<any>, parent2: GenericChromosome<any>) => GenericChromosome<any>[],
	mutation?: (chromosomes: GenericChromosome<number>[], chance: number, mutationRange: number) => GenericChromosome<any>[]
};