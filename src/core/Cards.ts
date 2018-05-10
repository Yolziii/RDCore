import {IDictionary} from "../util/Dictionaries";
import {RDErrorCode} from "./RDErrorCode";
import RDError from "./RDError";
import {CellType, ICell, IPlayableCell, IServiceCell} from "./Cells";
import {IDice} from "./Dices";

export interface ICard {
    readonly finished: boolean;

    hasCell(type: CellType): boolean;
    getCell(type: CellType): IPlayableCell | IServiceCell;

    getCellPlayable(type: CellType): IPlayableCell;
    getCellService(type: CellType): IServiceCell;

    fillCell(cellType: CellType, dice: IDice);
}

export class Card implements ICard {
    private static isPlayableCell(cell: IPlayableCell | IServiceCell): cell is IPlayableCell {
        return (cell as IPlayableCell).dice !== undefined;
    }

    private cells: IDictionary<ICell> = {};

    constructor(cells: ICell[]) {
        if (cells === undefined  || cells.length === 0) {
            throw new RDError(RDErrorCode.NO_ANY_CELL, "Card must contain cells!");
        }

        for (const someCell of cells) {
            const cell: IPlayableCell | IServiceCell = someCell as IPlayableCell | IServiceCell;
            if (this.cells[cell.type] != null) {
                // TODO: Выкидывать исключение
            }

            if (!Card.isPlayableCell(cell)) {
                cell.linkCard(this);
            }

            this.cells[cell.type] = cell;
        }

        if (this.cells[CellType.ServiceFinalScore] === undefined) {
            throw new RDError(RDErrorCode.NO_FINAL_SCORE_CELL, "Card must contain at least CellType.ServiceFinalScore cell!");
        }
    }

    public get finished() {
        for (const type in this.cells) {
            if (!this.cells.hasOwnProperty(type)) {
                continue;
            }
            const cell: IPlayableCell | IServiceCell = this.getCell(type as CellType);
            if (Card.isPlayableCell(cell)) {
                if (!cell.isFull) {
                    return false;
                }
            }
        }
        return true;
    }

    public hasCell(type: CellType): boolean {
        return this.cells[type] !== undefined;
    }

    public getCell(type: CellType): IPlayableCell | IServiceCell {
        const cell: ICell = this.cells[type];
        if (cell === undefined) {
            // TODO: Выкидывать исключение
        }
        return cell as IPlayableCell | IServiceCell;
    }

    public fillCell(type: CellType, dice: IDice) {
        const cell = this.getCell(type);
        if (Card.isPlayableCell(cell)) {
            cell.fill(dice);
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }

    public getCellPlayable(type: CellType): IPlayableCell {
        const cell = this.getCell(type);
        if (Card.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }

    public getCellService(type: CellType): IServiceCell {
        const cell = this.getCell(type);
        if (!Card.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }
}
