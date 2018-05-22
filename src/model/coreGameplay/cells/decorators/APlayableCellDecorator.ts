import {CellType} from "../CellType";
import {IPlayableCell} from "../IPlayableCell";
import {IDice} from "../../dice/IDice";

/**
 * Базовый класс для всех декораторов играбельных ячеек
 */
export abstract class APlayableCellDecorator implements IPlayableCell {
    protected cell:IPlayableCell;

    constructor(cell:IPlayableCell) {
        this.cell = cell;
    }

    public get isFull():boolean {
        return this.cell.isFull;
    }

    public get dice(): IDice {
        return this.cell.dice;
    }

    public fill(dice: IDice): void {
        this.cell.fill(dice);
    }

    public get type(): CellType {
        return this.cell.type;
    }

    public abstract valueFor(dice: IDice):number;
    public abstract get value():number;
}
