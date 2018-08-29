import {StateSlot} from "../../StateSlot";
import {AppEvent} from "../../AppEvent";
import {CellType} from "../../../model/coreGameplay/cells/CellType";

/** Событие, по которому клиент заполняет указанную ячейку в текущей карточке */
export class RoundFillCellAppEvent extends AppEvent {
    public cellType:CellType;

    constructor(cellType:CellType) {
        super(StateSlot.RoundFillCell);
        this.cellType = cellType;
    }

    public toJSON(): any { // TODO: Можно прибить?
        const json = Object.assign({}, this);
        json.cellType = CellType[this.cellType];
        return json;
    }
}
