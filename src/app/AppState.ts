import {Application} from "./Application";
import {IDeserializer} from "./IDeserializer";
import {IAppEvent} from "./IAppEvent";
import {IAppState} from "./IAppState";
import {Slot} from "./Slot";
import {AppEvent} from "./AppEvent";

/**
 * Базовый класс для всех стейтов приложения
 */
export class AppState implements IAppState, IDeserializer {
    protected _slot:Slot;
    protected _app:Application;

    constructor(slot:Slot) {
        this._slot = slot;
    }

    public linkApplication(app:Application) {
        this._app = app;
    }

    public get slot():Slot {
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
