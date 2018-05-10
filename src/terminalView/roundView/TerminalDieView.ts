import {ATerminalView} from "../ATerminalView";
import {DieType, IDie} from "../../core/Dices";
import chalk from "chalk";

export class TerminalDieView extends ATerminalView {
    private die:IDie;
    public init(die:IDie) {
        this.die = die;
    }

    public draw() {
        this.startDraw();

        if (this.die.type === DieType.Value) {
            switch (this.die.value) {
                case 1:
                    this.line(chalk.bgWhite.black("     "));
                    this.line(chalk.bgWhite.black("  *  "));
                    this.line(chalk.bgWhite.black("     "));
                    break;

                case 2:
                    this.line(chalk.bgWhite.black("    *"));
                    this.line(chalk.bgWhite.black("     "));
                    this.line(chalk.bgWhite.black("*    "));
                    break;

                case 3:
                    this.line(chalk.bgWhite.black("*    "));
                    this.line(chalk.bgWhite.black("  *  "));
                    this.line(chalk.bgWhite.black("    *"));
                    break;

                case 4:
                    this.line(chalk.bgWhite.black("*   *"));
                    this.line(chalk.bgWhite.black("     "));
                    this.line(chalk.bgWhite.black("*   *"));
                    break;

                case 5:
                    this.line(chalk.bgWhite.black("*   *"));
                    this.line(chalk.bgWhite.black("  *  "));
                    this.line(chalk.bgWhite.black("*   *"));
                    break;

                case 6:
                    this.line(chalk.bgWhite.black("*   *"));
                    this.line(chalk.bgWhite.black("*   *"));
                    this.line(chalk.bgWhite.black("*   *"));
                    break;
            }
        } else if (this.die.type === DieType.Blocked) {
            this.line(chalk.red(" \\ / "));
            this.line(chalk.red(`  X  `));
            this.line(chalk.red(` / \\ `));
        } else if (this.die.type === DieType.Empty) {
            this.line(chalk.gray("- - -"));
            this.line(chalk.gray(`- - -`));
            this.line(chalk.gray(`- - -`));
        }
    }
}
