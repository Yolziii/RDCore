import {Protocol} from "../client/Protocol";
import {IDictionaryInt} from "../util/Dictionaries";
import {RDErrorCode} from "../core/RDErrorCode";
import RDError from "../core/RDError";
import {IViewFactory} from "../client/IViewFactory";

/**
 * Интерфейс для состояний, которые динамически управляют слотами приложения
 */
export interface IDynamicGraphState extends IAppState { // TODO: Вызывать методы перед активацией и после выхода
    /** Добавить новые состояния в слоты приложения */
    fillStates();

    /** Очистить ранее добавленные состояния из слотов приложения */
    clearStates();
}
function isDynamicGraphState(state:IAppState):state is IDynamicGraphState {
    return (state as IDynamicGraphState).fillStates !== undefined;
}

export interface IApplication {
    /** Текущее состояние */
    readonly activeState:IAppState;

    /** Заполняет указанный слот указанным состоянием */
    fillSlot(slot:Protocol, state: IAppState);

    /** Освобождает указанный слот состояния */
    clearSlot(slot:Protocol);

    /**
     * Переводит приложение в указанное состояние
     * @param {Protocol} slot Идентификатор состояния
     * @param {IAppEvent} event Параметры перехода, которіе передаются состоянию при активации
     */
    toState(slot:Protocol, event:IAppEvent);

    /**
     * Выходит из текущего активного состояния и переходит в указанное
     * @param {Protocol} slot
     * @param {IAppEvent} event
     */
    exitToState(slot:Protocol, event:IAppEvent);

    /**
     * Переводит приложение в описанное событием состояние
     * @param {IAppEvent} event
     */
    onEvent(event:IAppEvent);

    /**
     * Выходит ищ текущего состояние и переводит приложение в описанное событием состояние
     * @param {IAppEvent} event
     */
    onExitEvent(event:IAppEvent);
}

export interface IClientApplication {
    /** Фабрика, создающая представления */
    readonly viewFactory:IViewFactory;
}

/**
 * Каркас для приложений проекта (клиента, сервера, утилит и тестовых окружений)
 */
export class Application implements IApplication {
    private _activeState:IAppState = null;
    private _viewFactory:IViewFactory;

    private slots:IDictionaryInt<IAppState> = {};
    private stack:IAppState[] = [];

    constructor(viewFactory:IViewFactory) {
        this._viewFactory = viewFactory;
    }

    public fillSlot(slot:Protocol, state: IAppState):void {
        if (this.slots[slot] !== undefined) {
            throw new RDError(RDErrorCode.SLOT_ALREADY_FILLED, `Slot ${slot} is already filled!`);
        }
        state.link(slot, this);
        state.init();
        this.slots[slot] = state;
    }

    public clearSlot(slot:Protocol):void {
        if (this.slots[slot] === undefined) {
            throw new RDError(RDErrorCode.UNREGISTERED_SLOT, `Slot ${slot} is not filled!`);
        }
        delete(this.slots[slot]);
    }

    public get activeState():IAppState {
        return this._activeState;
    }

    public get viewFactory():IViewFactory {
        return this._viewFactory;
    }

    public toState(slot:Protocol, event:IAppEvent = null) {
        if (this.slots[slot] === undefined) {
            // TODO: Debug message UNREGISTERED_SLOT
            return;
        }

        const targetState: IAppState = this.slots[slot];
        if (this.activeState === targetState) {
            throw new RDError(RDErrorCode.STATE_ALREADY_ACTIVE, `State for slot ${slot} is already active!`);
        }

        let ai = this.stack.indexOf(targetState);
        if (ai !== -1) { // Если состояние, в которое нужно перейти находится в стеке, то выходим из всех других состояний по дороге к нему
            while (ai !== -1) {
                const state = this.stack.pop();
                if (state === targetState) {
                    break;
                }

                this.exit(state);

                ai = this.stack.indexOf(targetState);
            }
            this._activeState = targetState;
            targetState.wakeup(event);
        } else {
            this.holdActive(targetState.doesPutActiveToSleep);

            this._activeState = targetState;
            if (isDynamicGraphState(targetState)) {
                targetState.fillStates();
            }
            targetState.activate(event);
        }
    }

    public onEvent(event:IAppEvent) {
        this.toState(event.id, event);
    }

    public exitToState(slot:Protocol, event:IAppEvent) {
        this.exit(this._activeState);
        this._activeState = null;
        this.toState(slot, event);
    }

    public onExitEvent(event:IAppEvent) {
        this.exit(this._activeState);
        this._activeState = null;
        this.toState(event.id, event);
    }

    private exit(state:IAppState) {
        if (isDynamicGraphState(state)) {
            state.clearStates();
        }
        state.sleep();
        state.exit();

        if (state.clearSlotAfterExit) {
            this.clearSlot(state.slot);
        }
    }

    private holdActive(sleep) {
        if (this._activeState == null) {
            return;
        }

        if (sleep) {
            this._activeState.sleep();
        }
        this.stack.push(this._activeState);
    }
}

export interface IAppEvent {
    readonly id: Protocol;
}

export class AppEvent implements IAppEvent {
    protected _id:Protocol;

    public get id():Protocol {
        return this._id;
    }

    constructor(id:Protocol) {
        this._id = id;
    }
}

/**
 * Определяет интерфейс для состояний приложения.
 */
export interface IAppState {
    /** Приложение, для которого состояние было создано */
    readonly app:Application;

    /** Слот состояния приложения, в который будет помещено состояние */
    readonly slot:Protocol;

    /** Должен ли переход в это состояние приводить к приостановке текущего состояния */
    readonly doesPutActiveToSleep:boolean;

    /** Определяет, должно ли приложение очистить слот после выхода из состочния  */
    readonly clearSlotAfterExit:boolean;

    /** Привязывает состояние к слоту и приложению */
    link(slot:Protocol, app:Application);

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

export class AppState implements IAppState {
    protected _slot:Protocol;
    protected _app:Application;

    public link(slot:Protocol, app:Application) {
        this._slot = slot;
        this._app = app;
    }

    public get slot():Protocol {
        return this._slot;
    }

    public get app():Application {
        return this._app;
    }

    public sleep() {/**/}

    public wakeup() {/**/}

    public activate(event:IAppEvent = null) {/**/}

    public exit() {/**/}

    public init() {/**/}

    public get clearSlotAfterExit() {
        return false;
    }

    public get doesPutActiveToSleep() {
        return true;
    }
}
