import {ISerializable} from "./ISerializable";

/**
 * Событие приложения
 */
export interface IAppEvent extends ISerializable {

    /** Слот, в котором должен находитсяч стейт приложения, которое обрабатывает данное событие */
    slot: number;
}
