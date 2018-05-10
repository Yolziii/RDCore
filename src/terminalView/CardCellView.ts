import {ATerminalView} from "./ATerminalView";
import chalk from "chalk";
import {IPlayableCell} from "../core/Cells";

export class CardCellView extends ATerminalView {
    private cell: IPlayableCell;
    private key: string;

    public init(key: string, cell: IPlayableCell) {
        this.key = key;
        this.cell = cell;
    }

    public draw() {
        this.startDraw();

        let value = " - ";
        if (this.cell.isFull) {
            value = this.cell.value.toString();
        }

        this.line(chalk.gray(`[${this.key}] `));
    }
}