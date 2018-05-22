import {RDErrorCode} from "../model/RDErrorCode";
import RDError from "../model/RDError";
import {Logger} from "../util/logger/Logger";
import {ILocalApplication} from "./ILocalApplication";
import {IAppEvent} from "./IAppEvent";
import {IAppState} from "./IAppState";
import {Slot} from "./Slot";
import {IDictionaryInt} from "../util/IDictionaryInt";

/**
 * Каркас для приложений проекта (клиента, сервера, утилит и тестовых окружений)
 */
export class Application implements ILocalApplication {
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
            Logger.warning(`Unknown state for slot ${slot}!`);
            // TODO: Debug message UNREGISTERED_SLOT
            return;
        }

        const targetState: IAppState = this.slots[slot];
        if (this.currentState === targetState) {
            Logger.error(`State for slot %s is already active!`, slot);
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

            this.logStateMethod("wakeup", slot);
            targetState.wakeup(event);
        } else {
            this.holdActive(targetState.doesPutActiveToSleep);

            this._currentState = targetState;

            this.logStateMethod("active", slot);
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

    public getState(slot:Slot):IAppState {
        const state = this.slots[slot];
        if (state == null) {
            // TODO: Exception
        }
        return state;
    }

    public prototypeFor(slot:Slot):any {
        if (this.eventPrototypes[slot] == null) {
            throw new RDError(RDErrorCode.UNDEFINED, `Unknown prototype for slot ${slot}`);
        }
        return this.eventPrototypes[slot];
    }

    protected logStateMethod(method:string, slot:Slot) {
        Logger.info("<activate> for: " + Slot[slot]);
    }

    private exit(state:IAppState) {
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
