import {StateSlot} from "./StateSlot";
import {IAppState} from "./IAppState";
import {IRemoteApplication} from "./IRemoteApplication";

/**
 * Приложение, которое выполняется локально
 */
export interface ILocalApplication extends IRemoteApplication {
    /** Текущее состояние */
    readonly currentState:IAppState;

    /** Заполняет указанный слот указанным состоянием */
    fillSlot(state: IAppState);

    /** Освобождает указанный слот состояния */
    clearSlot(slot:StateSlot);

    /**
     * Возвращает состояние в указанном слоте
     * @param {StateSlot} slot
     */
    getState(slot:StateSlot);
}
