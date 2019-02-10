import { pinCount } from './config';
import { log } from "util";

class Frame {
    set nextFrame(value: this) {
        this._nextFrame = value;
    }

    get sumOfThrows(): number {
        return this._sumOfThrows;
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
    private _nextFrame: this | false;
    private _sumOfThrows: number;
    private _throws: number[];
    private _isSpare: boolean;
    private _isStrike: boolean;
    private _isComplete: boolean;

    constructor(maxThrows, nextFrame?) {
        this.maxThrows = maxThrows;
        this._nextFrame = nextFrame;
        this._sumOfThrows = 0;
        this._throws = [];
        this._isSpare = false;
        this._isStrike = false;
        this._isComplete = false;
    }

    public update(count: number): this {
        this._throws = [ ...this._throws, ...[ count ] ];
        this._sumOfThrows = this._throws.reduce((acc, value) => acc + value, 0);
        this._isSpare = this.evaluateIfSpare();
        this._isStrike = this.evaluateIfStrike();
        this._isComplete = this.evaluateIfComplete();
        return this;
    }

    public evaluateIfSpare(): boolean {
        return (this._throws.length > 1) && (this._sumOfThrows === pinCount);
    }

    public evaluateIfStrike(): boolean {
        return (this.throws.length === 1) && (this._sumOfThrows === pinCount);
    }

    public evaluateIfComplete(): boolean {
        return this.isSpare
            || this.isStrike
            || (this._throws.length === this.maxThrows);
    }

    public getScore(): number {
        let score = this.sumOfThrows;
        // const lastScore = this._getFrame(0).sumOfThrows;
        // console.log(lastScore);
        // console.log(lastScore);
        // if (this.isSpare) score += (this._nextThrows[0] || 0);
        // if (this.isStrike) score += ((this._nextThrows[0] || 0) + (this._nextThrows[1] || 0));
        return score
    }

    public serialize(): object {
        return {
            throws: this.throws,
            isSpare: this.isSpare,
            isStrike: this.isStrike,
            isComplete: this.isComplete,
            totalScore: this.getScore()
        }
    }

}

export default Frame;
