import {Application} from "./Application";
import {IDeserializer} from "./IDeserializer";
import {IAppEvent} from "./IAppEvent";
import {StateSlot} from "./StateSlot";

/**
 * Стейт, в котором может находится приложение
 */
export interface IAppState extends IDeserializer {
    /** Приложение, для которого состояние было создано */
    readonly app:Application;

    /** Слот состояния приложения, в который будет помещено состояние */
    readonly slot:StateSlot;

    /** Должен ли переход в это состояние приводить к приостановке текущего состояния */
    readonly doesPutActiveToSleep:boolean;

    /** Определяет, должно ли приложение очистить слот после выхода из состочния  */
    readonly clearSlotAfterExit:boolean;

    /** Привязывает состояние к слоту и приложению */
    linkApplication(app:Application);

    /** Инициализирует состояние до его активации */
    init();

    /** Активирует состояние и добавляет его в стек текущих состояний */
    activate(event:IAppEvent);

    /** Выходит из состояние и освобождает его ресурсы */
    exit();

    /** Приостанавливает состояние, но оставляет его в стеке текущих состояний */
    sleep();

    /** Снова делает активным приостановленное ранее состояние */
    wakeup(event:IAppEvent);
}
