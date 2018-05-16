import {ATerminalView} from "../ATerminalView";
import chalk from "chalk";

export class TerminalThrowButton extends ATerminalView {
    private enabled:boolean = false;
    private left:number = 3;

    public init(left:number) {
        this.left = left;
    }

    public draw() {
        let $name = "Throw";
        let $btn = "[Space]";
        if (this.enabled) {
            $name = chalk.white($name);
            $btn = chalk.yellowBright($btn);
        } else {
            $name = chalk.gray($name);
            $btn = chalk.gray($btn);
        }

        this.startDraw();
        this.line(chalk.gray(`|----- ${this.left} -|`));
        this.line(chalk.gray(`|  ${$name}  |`));
        this.line(chalk.gray(`| ${$btn} |`));
        this.line(chalk.gray("|---------|"));
    }

    public disable() {
        this.enabled = false;
        this.draw();
    }

    public enable() {
        this.enabled = true;
        this.draw();
    }
}
