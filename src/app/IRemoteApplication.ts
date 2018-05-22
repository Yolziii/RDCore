import {Slot} from "./Slot";
import {IAppEvent} from "./IAppEvent";

/**
 * Приложение, с которым можно общаться удаленно
 */
export interface IRemoteApplication {
    /**
     * Переходит в указанное состояние
     * @param {Slot} slot Идентификатор состояния
     */
    toState(slot:Slot);

    /**
     * Переходит в описанное событием состояние
     * @param {IAppEvent} event
     */
    proceedEvent(event:IAppEvent);

    /**
     * Выходит из текущего активного состояния и переходит в указанное
     * @param {Slot} slot
     */
    exitToState(slot:Slot);

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
