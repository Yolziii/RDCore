import {Protocol} from "./Protocol";
import {IDictionary, IDictionaryInt} from "../util/Dictionaries";
import {RDErrorCode} from "../model/RDErrorCode";
import RDError from "../model/RDError";
import {IViewFactory} from "../client/IViewFactory";
import {ClientConnection} from "../server/ClientConnection";

/**
 * APT
 */
export interface IRemoteApplication {
    /**
     * Переходит в указанное состояние
     * @param {Protocol} slot Идентификатор состояния
     * @param {IAppEvent} event Параметры перехода, которіе передаются состоянию при активации
     */
    toState(slot:Protocol);

    /**
     * Переходит в описанное событием состояние
     * @param {IAppEvent} event
     */
    proceedEvent(event:IAppEvent);

    /**
     * Выходит из текущего активного состояния и переходит в указанное
     * @param {Protocol} slot
     * @param {IAppEvent} event
     */
    exitToState(slot:Protocol);

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

export interface IApplication extends IRemoteApplication {
    /** Текущее состояние */
    readonly currentState:IAppState;

    /** Заполняет указанный слот указанным состоянием */
    fillSlot(state: IAppState);

    /** Освобождает указанный слот состояния */
    clearSlot(slot:Protocol);

    /**
     * Возвращает состояние в указанном слоте
     * @param {Protocol} slot
     */
    getState(slot:Protocol);
}

export interface IClientApplication {
    /** Фабрика, создающая представления */
    readonly viewFactory:IViewFactory;
}

/**
 * Каркас для приложений проекта (клиента, сервера, утилит и тестовых окружений)
 */
export class Application implements IApplication {
    private _currentState:IAppState = null;

    private slots:IDictionaryInt<IAppState> = {};
    private stack:IAppState[] = [];

    private eventPrototypes:any;

    constructor(eventPrototypes:any) {
        this.eventPrototypes = eventPrototypes;
    }

    public fillSlot(state: IAppState):void {
        if (this.slots[state.slot] !== undefined) {
            throw new RDError(RDErrorCode.SLOT_ALREADY_FILLED, `Slot ${state.slot} is already filled!`);
        }
        state.linkApplication(this);
        state.init();
        this.slots[state.slot] = state;
    }

    public clearSlot(slot:number):void {
        delete(this.slots[slot]);
    }

    public get currentState():IAppState {
        return this._currentState;
    }

    public toState(slot:number, event:IAppEvent = null) { // TODO: Вынести реализцаю в отдельный внутренний метод
        if (this.slots[slot] === undefined) {
            (console).log(`Unknown state for slot ${slot}!`);
            // TODO: Debug message UNREGISTERED_SLOT
            return;
        }

        const targetState: IAppState = this.slots[slot];
        if (this.currentState === targetState) {
            (console).log("slot: " + slot);
            throw new RDError(RDErrorCode.STATE_ALREADY_ACTIVE, `State for slot ${slot} is already active!`);
        }

        let ai = this.stack.indexOf(targetState);
        if (ai !== -1) { // Если состояние, в которое нужно перейти находится в стеке, то выходим из всех других состояний по дороге к нему
            if (this._currentState != null) {
                this.exit(this._currentState);
            }
            while (ai !== -1) {
                const state = this.stack.pop();
                if (state === targetState) {
                    break;
                }

                this.exit(state);

                ai = this.stack.indexOf(targetState);
            }
            this._currentState = targetState;

            (console).log("<wakeup> for: " + Protocol[slot]);
            targetState.wakeup(event);
        } else {
            this.holdActive(targetState.doesPutActiveToSleep);

            this._currentState = targetState;

            (console).log("<activate> for: " + Protocol[slot]);
            targetState.activate(event);
        }
    }

    public proceedEvent(event:IAppEvent) {
        this.toState(event.slot, event);
    }

    public exitToState(slot:number) {
        this.exit(this._currentState);
        this._currentState = null;
        this.toState(slot);
    }

    public proceedExitToEvent(event:IAppEvent) {
        this.exit(this._currentState);
        this._currentState = null;
        this.toState(event.slot, event);
    }

    public exitToPreviousState() {
        const state:IAppState = this.stack[this.stack.length-1];
        this.toState(state.slot);
    }

    public getState(slot:Protocol):IAppState {
        const state = this.slots[slot];
        if (state == null) {
            // TODO: Exception
        }
        return state;
    }

    public prototypeFor(slot:Protocol):any {
        if (this.eventPrototypes[slot] == null) {
            throw new RDError(RDErrorCode.UNDEFINED, `Unknown prototype for slot ${slot}`);
        }
        return this.eventPrototypes[slot];
    }

    private exit(state:IAppState, newOne:IAppState=null) {
        state.sleep();
        state.exit();

        if (state.clearSlotAfterExit) {
            this.clearSlot(state.slot); // TODO: Дать возможность стейту обрабатывать несколько меседжей?
        }
    }

    private holdActive(sleep) {
        if (this._currentState == null) {
            return;
        }

        if (sleep) {
            this._currentState.sleep();
        }
        this.stack.push(this._currentState);
    }
}

export class ClientApplication extends Application implements IClientApplication {
    private _viewFactory:IViewFactory;
    private _appServer:IRemoteApplication;

    constructor(eventPrototypes:any, viewFactory:IViewFactory, appServer:IRemoteApplication) {
        super(eventPrototypes);
        this._viewFactory = viewFactory;
        this._appServer = appServer;
    }

    public get viewFactory():IViewFactory {
        return this._viewFactory;
    }
}

/** Зеркало клиента на строне сервера */
export class ClientMirrorApplication extends Application {
    private _connection:ClientConnection;

    public linkConnection(connection:ClientConnection) {
        this._connection = connection;
    }

    public get connection():ClientConnection {
        return this._connection;
    }
}

export interface IAppEvent extends ISerializable {
    slot: number;
}

export interface ISerializable {
    /** Сериализует объект в JSON */
    toJSON(): any;
}

export interface IDeserializer {
    /** Десериализует объект из JSON'a */
    fromJSON(json: any): any;
}

export class AppEvent implements IAppEvent, ISerializable {
    public slot:number;

    constructor(slot:number) {
        this.slot = slot;
    }

    public toJSON() {
        return Object.assign({}, this);
    }
}

export interface IAppState extends IDeserializer {
    /** Приложение, для которого состояние было создано */
    readonly app:Application;

    /** Слот состояния приложения, в который будет помещено состояние */
    readonly slot:Protocol;

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

export class AppState implements IAppState, IDeserializer {
    protected _slot:Protocol;
    protected _app:Application;

    constructor(slot:Protocol) {
        this._slot = slot;
    }

    public linkApplication(app:Application) {
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

    public fromJSON(json: any): AppEvent {
        const event = Object.create(this.app.prototypeFor(json.slot));
        return Object.assign(event, json);
    }
}

/** Состояние клиента, которое должно взаимодействовать с сервером */
export class ClientSideAppState extends AppState {
    protected appServer:IRemoteApplication;

    constructor(slot:Protocol, appServer:IRemoteApplication) {
        super(slot);
        this.appServer = appServer;
    }
}

/** Состояние сервера, которое должно взаимодействовать с клиентом */
export class ServerSideAppState extends AppState {
    protected appClient:IRemoteApplication;

    constructor(slot:Protocol, appClient:IRemoteApplication) {
        super(slot);
        this.appClient = appClient;
    }
}
