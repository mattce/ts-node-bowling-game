import inquirer from 'inquirer';

import { pinCount } from './config';
import FrameSet from './FrameSet';
import PrintService from './PrintService';

class App {

    FrameSet: FrameSet;
    PrintService: PrintService;
    baseQuestion: inquirer.Question;

    constructor() {
        this.FrameSet = new FrameSet();
        this.PrintService = new PrintService();
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
                if (this.FrameSet.isComplete) {
                    return Promise.reject('Frameset is complete')
                }
                // this.PrintService.print(this.FrameSet.serializeFrames());
                console.log(this.FrameSet.serializeFrames());
                return Promise.resolve();
            })
            .then(() => {
                this.start();
            })
            .catch((error) => {
                console.error(error);
            })
    }

    private static calculateChoices(lastCount): string[] {
        const maxCount = pinCount - lastCount;
        return [...Array(maxCount + 1).keys()].map(v => v + '')
    }
}

export default App;