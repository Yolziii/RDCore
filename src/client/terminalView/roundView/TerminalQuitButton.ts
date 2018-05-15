import {ATerminalView} from "../ATerminalView";
import chalk from "chalk";

export class TerminalQuitButton extends ATerminalView {
    public draw() {
        this.startDraw();
        this.line(chalk.gray(`|--------|`));
        this.line(chalk.gray(`|  Quit  |`));
        this.line(chalk.gray(`|   ${chalk.yellowBright("[Q]")}  |`));
        this.line(chalk.gray("|--------|"));
    }
}
