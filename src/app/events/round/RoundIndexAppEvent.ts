import {StateSlot} from "../../StateSlot";
import {AppEvent} from "../../AppEvent";

/** Общее событие для всх сообщений, использующих один индекс в качестве данных */
export class RoundIndexAppEvent extends AppEvent {
    public index:number;

    constructor(slot:StateSlot, index:number) {
        super(slot);
        this.index = index;
    }
}
