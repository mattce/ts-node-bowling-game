enum Line {
    Ctl = '\u250C',
    Ctr = '\u2510',
    Cbl = '\u2514',
    Cbr = '\u2518',
    Lv = '\u2502',
    Lh = '\u2500',
    Tt = '\u252C',
    Tr = '\u2524',
    Tb = '\u2534',
    Tl = '\u251C',
    P = '\u253C'
}

type frame = { throws: number[], isSpare: boolean, isStrike: boolean, isComplete: boolean, score: number };
type frames = frame[];

class PrintService {

    public print(frames) {
        const completedFrames = frames.filter((frames) => frames.isComplete);
        // console.log(this.horizontalLineTop(frames));
        // console.log(this.singleScoreLine(frames));
        // console.log(this.horizontalLineMiddle(frames));
        // console.log(this.totalScoreLine(frames));
        // console.log(this.horizontalLineBottom(frames));
        console.log(frames);
    }

    private horizontalLineTop(frames: frames): string {
        return [ ...Array(frames.length) ]
            .reduce((acc, value, index) => {
                const lastFrame = index === frames.length - 1;
                return acc + Line.Lh + Line.Tt + Line.Lh + (lastFrame ? Line.Ctr : Line.Tt);
            }, Line.Ctl);
    }

    private singleScoreLine(frames: frames): string {
        return [ ...Array(frames.length) ]
            .reduce((acc, value, index) => {
                const scores = frames[index].throws.map((_throw) => (!_throw ? '' : _throw));
                return acc + scores[0] + Line.Lv + scores[1] + Line.Lv;
            }, Line.Lv);
    }

    private horizontalLineMiddle(frames: frames): string {
        return [ ...Array(frames.length) ]
            .reduce((acc, value, index, arr) => {
                const lastFrame = index === arr.length - 1;
                return acc + Line.Lh + Line.Tb + Line.Lh + (lastFrame ? Line.Tr : Line.P);
            }, Line.Tl);
    }

    private totalScoreLine(frames: frames): string {
        return [ ...Array(frames.length) ]
            .reduce((acc, value, index) => {
                const score = frames[index].score;
                return acc
                    + (score < 10 ? ' ' : '')
                    + score
                    + (score < 100 ? ' ' : '')
                    + Line.Lv;
            }, Line.Lv);
    }

    private horizontalLineBottom(frames: object[]): string {
        return [ ...Array(frames.length) ]
            .reduce((acc, value, index, arr) => {
                const lastFrame = index === arr.length - 1;
                return acc + Line.Lh + Line.Lh + Line.Lh + (lastFrame ? Line.Cbr : Line.Tb);
            }, Line.Cbl);
    }

}

export default PrintService;
