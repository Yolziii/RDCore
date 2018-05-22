import {IDice} from "../../dice/IDice";
import {RoundEvent} from "./RoundEvent";
import {RoundEventType} from "../RoundEventType";

export class RoundEventThrowedDice extends RoundEvent {
    public dice:IDice;

    constructor(dice:IDice) {
        super(RoundEventType.Throw);
        this.dice = dice;
    }
}
