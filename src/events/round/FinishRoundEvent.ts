import {Slot} from "../../app/Slot";
import {AppEvent} from "../../app/AppEvent";
import {IRound} from "../../model/coreGameplay/round/IRound";

export class FinishRoundEvent extends AppEvent {
    public readonly model:IRound;

    constructor(model:IRound) {
        super(Slot.RoundResult);
        this.model = model;
    }
}
