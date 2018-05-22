import {ATerminalView} from "../ATerminalView";
import {TermninalCellView} from "./TerminalCellView";
import chalk from "chalk";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {ICard} from "../../../../model/coreGameplay/Card";
import {IDictionary} from "../../../../util/IDictionary";
import {CellType} from "../../../../model/coreGameplay/cells/CellType";
import {ICell} from "../../../../model/coreGameplay/cells/ICell";

const cardKeys = ["f1", "f2", "f3"];

export class TerminalCardView extends ATerminalView {
    private model:IRound;
    private card:ICard;
    private keyForType:IDictionary<string>;
    private index:number;

    private cellViews:TermninalCellView[] = [];

    constructor(x:number, y:number, model:IRound, keyForType:IDictionary<string>, index:number = 0) {
        super(x, y);

        this.model = model;
        this.model.selectCard(index);
        this.card = this.model.getCard();

        this.keyForType = keyForType;
        this.index = index;

        this.cellViews.length = 0;

        let yi = this.y;
        for (const type in CellType) {
            if (!this.card.hasCell(type as CellType)) {
                continue;
            }

            const cell:ICell = this.card.getCell(type as CellType);
            const cellView:TermninalCellView = new TermninalCellView(this.x, yi);

            const key = (this.keyForType[cell.type] !== undefined) ? this.keyForType[cell.type] : "";
            cellView.init(key, cell);
            this.cellViews.push(cellView);
            yi++;
        }
    }

    public draw() {
        for (const cellView of this.cellViews) {
            if (!this.active && cellView.isEnabled()) {
                cellView.disable();
            } else if (this.active && !cellView.isEnabled()) {
                cellView.enable();
            }
            cellView.draw();
        }

        this.drawCardKey();
    }

    public enableCells() {
        for (const cellView of this.cellViews) {
            if (this.active) {
                cellView.enable();
            } else {
                cellView.disable();
            }

        }
    }

    public disableCells() {
        for (const cellView of this.cellViews) {
            cellView.disable();
        }
    }

    private drawCardKey() {
        if (this.model.totalCards === 1) {
            return;
        }

        if (this.model.activeCardIndex === this.index) {
            this.place(chalk.gray("[" + cardKeys[this.index].toUpperCase() +"]"), this.x + 10, this.y - 1);
        } else {
            this.place(chalk.yellowBright("[" + cardKeys[this.index].toUpperCase() +"]"), this.x + 10, this.y - 1);
        }
    }

    private get active() {
        return this.model.totalCards === 1 || this.model.activeCardIndex === this.index;
    }
}
