import {ATerminalView} from "./ATerminalView";
import chalk from "chalk";

export class ThrowButton extends ATerminalView {
    public draw() {
        this.startDraw();
        this.line(chalk.gray("|---------|"));
        this.line(chalk.gray("|  Throw  |"));
        this.line(chalk.gray("| [Space] |"));
        this.line(chalk.gray("|---------|"));
    }
}
