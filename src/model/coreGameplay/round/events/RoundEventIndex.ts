import {RoundEvent} from "./RoundEvent";
import {RoundEventType} from "../RoundEventType";

export class RoundEventIndex extends RoundEvent {
    public index: number;

    constructor(type:RoundEventType, index: number) {
        super(type);
        this.index = index;
    }
}
