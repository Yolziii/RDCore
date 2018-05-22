import {RoundEvent} from "./events/RoundEvent";

export interface IRoundObserver {
    onRoundEvent(event:RoundEvent);
}
