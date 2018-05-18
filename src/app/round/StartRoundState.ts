import {AppEvent, AppState, IAppEvent, IAppState} from "../Application";
import {SingleResultScreenState} from "../resultScreen/SingleResultScreenState";
import {Protocol} from "../Protocol";
import {SingleRoundState} from "./SingleRoundState";
import {RoundMode} from "../mainScreen/MainScreenState";
import {QuitRoundState} from "./QuitRoundState";

export interface IStartRoundEventParams {
    mode:RoundMode;
    withJokers?:boolean;
}

export class StartRoundEvent extends AppEvent implements IStartRoundEventParams {
    private _mode:RoundMode;
    private _withJokers:boolean = false;

    constructor(params:IStartRoundEventParams) {
        super(Protocol.StartRound);
        this._mode = params.mode;
        if (params.withJokers != null) {
            this._withJokers = params.withJokers;
        }
    }

    public get withJokers() {
        return this._withJokers;
    }

    public get mode() {
        return this._mode;
    }
}

export class StartRoundState extends AppState implements IAppState {
    private singleRoundState: SingleRoundState;
    private singleResultScreenState: SingleResultScreenState;
    private immediatelyQuitState:QuitRoundState;

    constructor() {
        super(Protocol.StartRound);

        this.singleRoundState = new SingleRoundState();
        this.singleResultScreenState = new SingleResultScreenState();
        this.immediatelyQuitState = new QuitRoundState();
    }

    public activate(event:IAppEvent) {
        // TODO: Выбор режима
        this.app.fillSlot(this.singleRoundState);
        this.app.fillSlot(this.singleResultScreenState);
        this.app.fillSlot(this.immediatelyQuitState);

        event.slot = Protocol.Round;
        this.app.proceedEvent(event);
    }

    public exit() {
        this.app.clearSlot(Protocol.Round);
        this.app.clearSlot(Protocol.RoundResult);
        this.app.clearSlot(Protocol.RoundQuit);
    }
}
