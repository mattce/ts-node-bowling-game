import inquirer from 'inquirer';

import { pinCount, frameCount } from './config';
import FrameSet from './FrameSet';
import PrintService from './PrintService';

class App {

    FrameSet: FrameSet;
    PrintService: PrintService;
    baseQuestion: inquirer.Question;

    constructor() {
        this.FrameSet = new FrameSet();
        this.PrintService = new PrintService(frameCount);
        this.baseQuestion = {
            type: 'list',
            name: 'score',
            message: 'How many pins did you get?',
            choices: []
        }
    }

    public start() {
        const currentScore = this.FrameSet.getLastFrame().sumUpThrows();
        const question = {
            ...this.baseQuestion,
            ...{ choices: App.calculateChoices(currentScore) }
        };
        inquirer
            .prompt([question])
            .then(({ score }) => {
                this.FrameSet.applyScore(parseInt(score, 10));
            })
            .then(() => {
                return (this.FrameSet.isComplete) ?
                    Promise.reject() :
                    Promise.resolve();
            })
            .then(() => {
                this.start();
            })
            .catch(() => {
                this.PrintService.print(this.FrameSet.serializeFrames());
            })
    }

    private static calculateChoices(lastCount): string[] {
        const maxCount = pinCount - lastCount;
        return [...Array(maxCount + 1).keys()].map(v => v + '')
    }
}

export default App;