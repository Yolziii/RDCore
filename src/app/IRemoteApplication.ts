import {StateSlot} from "./StateSlot";
import {IAppEvent} from "./IAppEvent";

/**
 * Приложение, с которым можно общаться удаленно
 */
export interface IRemoteApplication {
    /**
     * Переходит в указанное состояние
     * @param {StateSlot} slot Идентификатор состояния
     */
    toState(slot:StateSlot);

    /**
     * Переходит в описанное событием состояние
     * @param {IAppEvent} event
     */
    proceedEvent(event:IAppEvent);

    /**
     * Выходит из текущего активного состояния и переходит в указанное
     * @param {StateSlot} slot
     */
    exitToState(slot:StateSlot);

    /**
     * Выходит из текущего состояние и переходит в описанное событием состояние
     * @param {IAppEvent} event
     */
    proceedExitToEvent(event:IAppEvent);

    /**
     * Выходит из текущего состояния и возвращается к предыдущему
     */
    exitToPreviousState();
}
