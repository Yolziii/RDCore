import {CellType} from "../../cells/CellType";
import {RoundEvent} from "./RoundEvent";
import {RoundEventType} from "../RoundEventType";

export class RoundEventFillCell extends RoundEvent {
    public cellType:CellType;

    constructor(type:RoundEventType, cellType:CellType) {
        super(type);
        this.cellType = cellType;
    }
}
