import {ATerminalView} from "../ATerminalView";
import chalk from "chalk";
import {CellType, ICell, IPlayableCell, IServiceCell} from "../../core/Cells";

export class TermninalCellView extends ATerminalView {
    private cell: ICell;
    private key: string;
    private enabled:boolean = false;

    public init(key: string, cell: ICell) {
        this.key = key;
        this.cell = cell;
    }

    public draw() {
        this.startDraw();

        let service = false;
        let serviceCell:IServiceCell = null;
        let playableCell:IPlayableCell = null;
        if (this.key !== "") {
            playableCell = this.cell as IPlayableCell;
        } else {
            serviceCell = this.cell as IServiceCell;
            service = true;
        }

        let $key = "   ";
        if (!service && !playableCell.isFull) {
            $key = "[" + this.key.toUpperCase() + "]";
        }

        let $line = this.enabled ? chalk.yellowBright($key) : chalk.gray($key);

        const NAME_LENGTH:number = 20;
        let $name:string = CellType[this.cell.type];
        while ($name.length < NAME_LENGTH) {
            $name = $name + ".";
        }
        $name = $name.substr(0, NAME_LENGTH);
        $line += " ";
        $line += service || !this.enabled ? chalk.gray($name) : chalk.white($name);

        let $value = "";
        if (service || playableCell.isFull) {
            $value = this.cell.value.toString();
        }

        while ($value.length < 4) {
            $value = " " + $value;
        }

        if (service) {
            $line += chalk.gray($value);
        } else {
            $line += chalk.white($value);
        }

        this.line($line);
    }

    public enable() {
        this.enabled = true;
        this.draw();
    }

    public disable() {
        this.enabled = false;
        this.draw();
    }

}
