import { pinCount } from './config';

class Frame {
    set nextFrame(value: this) {
        this._nextFrame = value;
    }

    get throws(): number[] {
        return this._throws;
    }

    get isSpare(): boolean {
        return this._isSpare;
    }

    get isStrike(): boolean {
        return this._isStrike;
    }

    get isComplete(): boolean {
        return this._isComplete;
    }

    private readonly maxThrows: number;
    private _nextFrame: any;
    private _throws: number[];
    private _isSpare: boolean;
    private _isStrike: boolean;
    private _isComplete: boolean;

    constructor(maxThrows) {
        this.maxThrows = maxThrows;
        this._nextFrame = null;
        this._throws = [];
        this._isSpare = false;
        this._isStrike = false;
        this._isComplete = false;
    }

    public update(count: number): this {
        this._throws = [...this._throws, ...[count]];
        this._isSpare = this.evaluateIfSpare();
        this._isStrike = this.evaluateIfStrike();
        this._isComplete = this.evaluateIfComplete();
        return this;
    }

    public evaluateIfSpare(): boolean {
        return (this._throws.length > 1) && (this.sumUpThrows() === pinCount);
    }

    public evaluateIfStrike(): boolean {
        return (this.throws.length === 1) && (this.sumUpThrows() === pinCount);
    }

    public evaluateIfComplete(): boolean {
        return this.isSpare
            || this.isStrike
            || (this._throws.length === this.maxThrows);
    }

    public getScore(modifier: number): number {
        console.log(this._nextFrame);
        return (!modifier) ?
            this.getOwnScore() :
            this.getOwnScore() + (this._nextFrame ? this._nextFrame.getNextScore(modifier) : 0);
    }

    private getOwnScore(): number {
        return this.sumUpThrows();
    }

    private getNextScore(nextScores: number): number {
        if (nextScores > this._throws.length) {
            if (this.isStrike) {
                return this.sumUpThrows() + this._nextFrame.getNextScore(nextScores - 1);
            }
            return this.sumUpThrows();
        }
        return this.sumUpThrows(nextScores);
    }

    public sumUpThrows(limit = 0): number {
        return this._throws.reduce((acc, value, index) => {
            return (limit > 0) ?
                acc + (index < limit ? value : 0) :
                acc + value;
        }, 0);
    }

    public serialize(): object {
        let modifier = 0;
        if (this.isSpare) modifier = 1;
        if (this.isStrike) modifier = 2;
        return {
            throws: this.throws,
            isSpare: this.isSpare,
            isStrike: this.isStrike,
            isComplete: this.isComplete,
            totalScore: this.getScore(modifier)
        }
    }

}

export default Frame;
