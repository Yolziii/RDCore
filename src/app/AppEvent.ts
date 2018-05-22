import {IAppEvent} from "./IAppEvent";
import {ISerializable} from "./ISerializable";

/**
 * Базовый класс для всех событие приложения
 */
export class AppEvent implements IAppEvent, ISerializable {
    public slot:number;

    constructor(slot:number) {
        this.slot = slot;
    }

    public toJSON() {
        return Object.assign({}, this);
    }
}
