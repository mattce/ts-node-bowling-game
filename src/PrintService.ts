import { specialThrowCount } from './config';
import { times, padArrayWith, padStringWith } from './Utils';

enum Line {
    Ctl = '\u250C', // Corner top left
    Ctr = '\u2510', // Corner top right
    Cbl = '\u2514', // Corner bottom left
    Cbr = '\u2518', // Corner bottom right
    Lv = '\u2502', // Left vertical
    Lh = '\u2500', // Left horizontal
    Tt = '\u252C', // 'T' shape top
    Tr = '\u2524', // 'T' shape right
    Tb = '\u2534', // 'T' shape bottom
    Tl = '\u251C', // 'T' shape left
    P = '\u253C' // Plus sign
}

type Frame = { throws: number[], isSpare: boolean, isStrike: boolean, isComplete: boolean, score: number };
type NormalizedFrame = Frame & { accumulatedScore: number };

class PrintService {

    private frameCount: number;

    constructor(frameCount) {
        this.frameCount = frameCount;
    }

    public print(frames) {
        const normalizedFrames = PrintService.normalizeFrames(frames);
        console.log(normalizedFrames);
        console.log(this.horizontalLineTop(normalizedFrames));
        console.log(this.singleScoreLine(normalizedFrames));
        console.log(this.horizontalLineMiddle());
        console.log(this.totalScoreLine(normalizedFrames));
        console.log(this.horizontalLineBottom());
    }

    static normalizeFrames(frames, index = 0): any[] {
        if (index === frames.length) { // exit early
            return frames;
        }
        const currentFrame = frames[index];
        const lastFrame = frames[index - 1];
        const lastScore = lastFrame ? lastFrame.accumulatedScore : 0;
        currentFrame.accumulatedScore = lastScore + currentFrame.score;
        return PrintService.normalizeFrames(frames, ++index);
    }

    private horizontalLineTop(frames: NormalizedFrame[]): string {
        return [...Array(this.frameCount)]
            .reduce((acc, value, index) => {
                const lastFrame = index === (frames.length - 1);
                const hr = times(2, Line.Lh);
                return acc + hr + Line.Tt + hr + Line.Tt + hr + (lastFrame ? Line.Ctr : Line.Tt);
            }, Line.Ctl);
    }

    private singleScoreLine(frames: NormalizedFrame[]): string {
        return [...Array(this.frameCount)]
            .reduce((acc, value, index) => {
                const throws = frames[index].throws;
                const scores = padArrayWith(throws, specialThrowCount, '');
                const normalizedThrows = scores.map((_throw) => padStringWith(_throw, 2, ' '));
                return acc + normalizedThrows.join(Line.Lv) + Line.Lv;
            }, Line.Lv);
    }

    private horizontalLineMiddle(): string {
        return [...Array(this.frameCount)]
            .reduce((acc, value, index, arr) => {
                const lastFrame = index === arr.length - 1;
                const hr = times(2, Line.Lh);
                return acc + times(2, hr + Line.Tb) + hr + (lastFrame ? Line.Tr : Line.P);
            }, Line.Tl);
    }

    private totalScoreLine(frames: NormalizedFrame[]): string {
        return [...Array(this.frameCount)]
            .reduce((acc, value, index) => {
                const score = padStringWith(frames[index].accumulatedScore, 2, ' ');
                const spaces = times(3, ' ');
                return acc + spaces + score + spaces + Line.Lv;
            }, Line.Lv);
    }

    private horizontalLineBottom(): string {
        return [...Array(this.frameCount)]
            .reduce((acc, value, index, arr) => {
                const lastFrame = index === arr.length - 1;
                const hr = times(8, Line.Lh);
                return acc + hr + (lastFrame ? Line.Cbr : Line.Tb);
            }, Line.Cbl);
    }

}

export default PrintService;


/*
┌──┬──┬──┬──┬──┬──┬──┬──┬──┐
│  │  │10│  │  │10│  │  │10│
├──┴──┴──┼──┴──┴──┼──┴──┴──┤
│   30   │   20   │   10   │
└────────┴────────┴────────┘
*/

