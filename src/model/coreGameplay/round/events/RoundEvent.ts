import {RoundEventType} from "../RoundEventType";

/** Базовый класс события игрового раунда */
export class RoundEvent {
    public type:RoundEventType;

    constructor(type:RoundEventType) {
        this.type = type;
    }
}
