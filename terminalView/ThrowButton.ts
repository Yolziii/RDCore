import {ATerminalView} from "./ATerminalView";

const chalk = require('chalk');

export class ThrowButton extends ATerminalView {
    draw() {
        this.startDraw();
        this.line(chalk.gray('|---------|');
        this.line(chalk.gray('|  Throw  |'));
        this.line(chalk.gray('| [Space] |'));
        this.line(chalk.gray('|---------|'));
    }
}