import {Protocol} from "./Protocol";
import {IDictionaryInt} from "../util/Dictionaries";
import {RDErrorCode} from "../core/RDErrorCode";
import RDError from "../core/RDError";
import {IViewFactory} from "./IViewFactory";

/**
 * Каркас для приложений проекта (клиента, сервера, утилит и тестовых окружений)
 */
export class Application {
    private _activeState:AppState = null;
    private stateFactories:IDictionaryInt<(id:Protocol, app:Application) => AppState> = {};
    private pool:IDictionaryInt<AppState> = {};
    private _viewFactory:IViewFactory;

    constructor(viewFactory:IViewFactory) {
        this._viewFactory = viewFactory;
    }

    /** Сопоставляет идентификатор состояния с фабричным методом, который создает экземпляр этого состояния */
    public addStateFactory(id:Protocol, stateFactory: (id:Protocol, app:Application) => AppState):void {
        if (this.stateFactories[id] !== undefined) {
            throw new RDError(RDErrorCode.STATE_ID_ALREADY_USED, `State ${Protocol[id]} already registered!`);
        }
        this.stateFactories[id] = stateFactory;
    }

    /** Освобождает указанный идентификатор состояния, и удаляет состояние их пула, если он там есть */
    public removeStateAndFactory(id:Protocol) {
        delete this.stateFactories[id];
        delete this.pool[id];
    }

    /** Текущее состояние */
    public get activeState():AppState {
        return this._activeState;
    }

    public get viewFactory():IViewFactory {
        return this._viewFactory;
    }

    /**
     * Переходит к указанному состоянию
     * @param {Protocol} id Идентификатор состояния
     * @param {IAppEvent} event Параметры для перехода
     */
    public toState(id:Protocol, event:IAppEvent = null) {
        if (this.stateFactories[id] === undefined) {
            // TODO: Debug message UNREGISTERED_PROTOCOL_ID
            return;
        }

        let state:AppState;
        const hasSate:boolean = this.activeState !== null && this.activeState.hasParent(id);
        if (hasSate) {
            state = this.activeState.backToParent(id);
        } else if (this.pool[id] !== undefined) {
            state = this.pool[id];
            state.activate(event);
            delete this.pool[id];
        } else {
            state = this.stateFactories[id](id, this);
            state.activate(event);

            if (this._activeState != null) {
                this._activeState.sleep();
            }
        }

        if (this._activeState != null) {
            state.linkParent(this.activeState);
        }
        this._activeState = state;
    }

    public onEvent(event:IAppEvent) {
        this.toState(event.id, event);
    }

    public holdState(state:AppState) {
        this.pool[state.id] = state;
    }
}

export interface IAppEvent {
    readonly id: Protocol;
    readonly version: number;
}

export class AppEvent implements IAppEvent {
    protected _id:Protocol;
    protected _version:number;

    public get id():Protocol {
        return this._id;
    }

    public get version():number {
        return this._version;
    }

    constructor(id:Protocol) {
        this._id = id;
        this._version = 1;
    }
}

export class AppState implements AppState {
    protected _id:Protocol;
    protected _app:Application;
    protected _parent:AppState = null;

    private _active:boolean = false;

    public get destroyable():boolean {
        return true;
    }

    constructor(id:Protocol, app:Application) {
        this._id = id;
        this._app = app;
        this.init();
    }

    public get id():Protocol {
        return this._id;
    }

    public get app():Application {
        return this._app;
    }

    public linkParent(parent:AppState) {
        this._parent = parent;
    }

    public unlinkParent() {
        this._parent = null;
    }

    public hasParent(id:Protocol):boolean {
        if (id === this.id) {
            return true;
        } else if (this._parent != null) {
            return this._parent.hasParent(id);
        }
        return false;
    }

    public getParent(id:Protocol):AppState {
        if (id === this.id) {
            return this;
        } else if (this._parent != null) {
            return this._parent.getParent(id);
        }
        // TODO: Исключение
    }

    public backToParent(id:Protocol):AppState {
        if (id === this.id) {
            return;
        }
        if (!this.hasParent(id)) {
            // TODO: Исключение - yt
        }

        this.exit();
        if (!this.destroyable) {
            this.app.holdState(this);
        }

        this._parent.backToParent(id);
        this.unlinkParent();
    }

    public get active() {
        return this._active;
    }

    public sleep() {
        this._active = false;
    }

    public wakeup() {
        this._active = true;
    }

    public activate(event:IAppEvent = null) {
        this._active = true;
    }

    /** Завершает действие */
    public end() {
        this.backToParent(this._parent.id);
    }

    protected exit() {
        this._active = false;
    }

    protected init() {/**/}
}
