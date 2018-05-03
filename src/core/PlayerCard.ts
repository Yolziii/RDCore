import {CellType, ICardCell, IPlayableCardCell, IPlayerCard, IServiceCardCell} from "./gameplay";
import {Dictionary} from "../util/Dictionary";
import {RDError, RDErrorCode} from "./RDError";

export class PlayerCard implements IPlayerCard {
    private static isPlayableCell(cell: IPlayableCardCell | IServiceCardCell): cell is IPlayableCardCell {
        return (cell as IPlayableCardCell).dice !== undefined;
    }

    private cells: Dictionary<ICardCell> = {};

    constructor(cells: ICardCell[]) {
        if (cells === undefined) {
            // TODO: Выкидывать исключение
        }
        if (cells.length === 0) {
            // TODO: Выкидывать исключение
        }

        for (const someCell of cells) {
            const cell: IPlayableCardCell | IServiceCardCell = someCell as IPlayableCardCell | IServiceCardCell;
            if (this.cells[cell.type] != null) {
                // TODO: Выкидывать исключение
            }

            if (!PlayerCard.isPlayableCell(cell)) {
                cell.linkCard(this);
            }

            this.cells[cell.type] = cell;
        }

        // TODO: Должно быть поле Total
    }

    public finished() {
        for (const type in this.cells) {
            if (!this.cells.hasOwnProperty(type)) {
                continue;
            }
            const cell: IPlayableCardCell | IServiceCardCell = this.getCell(type as CellType);
            if (PlayerCard.isPlayableCell(cell)) {
                if (!cell.isFull()) {
                    return false;
                }
            }
        }
        return true;
    }

    public hasCell(type: CellType): boolean {
        return this.cells[type] !== undefined;
    }

    public getCell(type: CellType): IPlayableCardCell | IServiceCardCell {
        const cell: ICardCell = this.cells[type];
        if (cell === undefined) {
            // TODO: Выкидывать исключение
        }
        return cell as IPlayableCardCell | IServiceCardCell;
    }

    public getCellPlayable(type: CellType): IPlayableCardCell {
        const cell = this.getCell(type);
        if (PlayerCard.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }

    public getCellService(type: CellType): IServiceCardCell {
        const cell = this.getCell(type);
        if (!PlayerCard.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
            throw new RDError(RDErrorCode.UNDEFINED);
        }
    }
}
