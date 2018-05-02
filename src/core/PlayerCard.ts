import {CellType, ICardCell, IPlayableCardCell, IPlayerCard, IServiceCardCell} from "../gameplay";
import {Dictionary} from "../util/Dictionary";

export class PlayerCard implements IPlayerCard {
    private fields:Dictionary<ICardCell> = {};

    constructor(fields:ICardCell[]) {
        if (fields == undefined) {
            // TODO: Выкидывать исключение
        }
        if (fields.length == 0) {
            // TODO: Выкидывать исключение
        }

        for (let i = 0; i < fields.length; i++) {
            let cell:IPlayableCardCell | IServiceCardCell = fields[i] as IPlayableCardCell | IServiceCardCell;
            if (this.fields[cell.type] != null) {
                // TODO: Выкидывать исключение
            }

            if (!PlayerCard.isPlayableCell(cell)) {
                cell.linkCard(this);
            }

            this.fields[cell.type] = cell;
        }

        // TODO: Должно быть поле Total
    }

    finished() {
        for (let type in this.fields) {
            let cell:IPlayableCardCell | IServiceCardCell = this.getCell(<CellType>type);
            if (PlayerCard.isPlayableCell(cell)) {
                if (!cell.isFull()) return false;
            }
        }
        return true;
    }

    private static isPlayableCell(cell:IPlayableCardCell | IServiceCardCell):cell is IPlayableCardCell {
        return (<IPlayableCardCell>cell).dice != undefined;
    }

    hasCell(type:CellType):boolean {
        return this.fields[type] != undefined;
    }

    getCell(type:CellType):IPlayableCardCell | IServiceCardCell {
        let cell:ICardCell = this.fields[type];
        if (cell == undefined) {
            // TODO: Выкидывать исключение
        }
        return cell as IPlayableCardCell | IServiceCardCell;
    }

    getCellPlayable(type:CellType):IPlayableCardCell {
        let cell = this.getCell(type);
        if (PlayerCard.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
        }
    }

    getCellService(type:CellType):IServiceCardCell {
        let cell = this.getCell(type);
        if (!PlayerCard.isPlayableCell(cell)) {
            return cell;
        } else {
            // TODO: Выкидывать исключение
        }
    }
}