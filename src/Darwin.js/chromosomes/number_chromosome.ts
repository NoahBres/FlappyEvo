import GenericChromosome from "./generic_chromosome";

export default class NumberChromosome extends GenericChromosome<number> {
    private _upperBound: number;
    private _lowerBound: number;
    private _round: boolean;
    private _clamp: boolean;

    constructor(length, genes, score, { lowerBound = 0, upperBound = 1, round = false, clamp = false }) {
        super(length, genes, score);

        this._upperBound = upperBound;
        this._lowerBound = lowerBound;
        this._round = round;
        this._clamp = clamp;

        if(this._lowerBound > this._upperBound)
            [this._lowerBound, this._upperBound] = [this._upperBound, this._lowerBound];
    }

    generate(): NumberChromosome {
        this._genes = [];

        for(let i = 0; i < this._length; i++) {
            let value = Math.floor(Math.random() * (this._upperBound + 1 - this._lowerBound) + this._lowerBound);

            this._genes.push(value);
        }

        return this;
    }

    duplicate(): NumberChromosome {
        return new NumberChromosome(this._length, this._genes, this._fitness, {
            lowerBound: this._lowerBound,
            upperBound: this._upperBound,
            round: this._round,
            clamp: this._clamp
        });
    }
}