import Frame from './Frame';
import { frameCount, defaultThrowCount, specialThrowCount } from './config';

class FrameSet {

    get isComplete(): boolean {
        return this._isComplete;
    }

    private _frames: Frame[];
    private _isComplete: boolean;

    constructor() {
        this._frames = [this.createFrame()];
        this._isComplete = false;
    }

    public getLastFrame(): Frame {
        return this._frames[this._frames.length - 1];
    }

    public applyScore(score: number) {
        const currentFrame = this.getLastFrame();
        currentFrame.update(score);
        if (currentFrame.isComplete && this._frames.length === frameCount) {
            this._isComplete = true;
            return;
        }
        if (currentFrame.isComplete) {
            this.addFrame();
        }
    }

    public serializeFrames(): object[] {
        return this._frames.map((frame) => frame.serialize());
    }

    private createFrame(): Frame {
        const maxThrows: number = (this._frames && this._frames.length === (frameCount - 1)) ?
            specialThrowCount :
            defaultThrowCount;
        return new Frame(maxThrows);
    }

    private addFrame(): void {
        const newFrame = this.createFrame();
        const lastFrame: Frame = this._frames[this._frames.length - 1];
        lastFrame.nextFrame = newFrame;
        this._frames = [...this._frames, newFrame];
    }

}

export default FrameSet;
