import {AppEvent, ClientSideAppState, IAppState, IRemoteApplication} from "../Application";
import {SingleResultScreenState} from "../resultScreen/SingleResultScreenState";
import {Protocol} from "../Protocol";
import {SingleRoundState} from "./SingleRoundState";
import {QuitRoundState} from "./QuitRoundState";
import {ClientSingleRoundState} from "./remote/ClientSingleRoundState";
import {RoundMode} from "./RoundMode";

export interface IStartRoundEventParams {
    mode:RoundMode;
    withJokers?:boolean;
}

export class StartRoundEvent extends AppEvent implements IStartRoundEventParams {
    public mode:RoundMode;
    public withJokers:boolean = false;

    constructor(params:IStartRoundEventParams) {
        super(Protocol.StartRound);
        this.mode = params.mode;
        if (params.withJokers != null) {
            this.withJokers = params.withJokers;
        }
    }
}

export class StartRoundState extends ClientSideAppState implements IAppState {
    private singleRoundState: SingleRoundState;
    private singleResultScreenState: SingleResultScreenState;
    private immediatelyQuitState:QuitRoundState;

    private clientSingleRound: ClientSingleRoundState;

    constructor(appServer:IRemoteApplication) {
        super(Protocol.StartRound, appServer);

        this.singleRoundState = new SingleRoundState();
        this.singleResultScreenState = new SingleResultScreenState();
        this.immediatelyQuitState = new QuitRoundState();

        this.clientSingleRound = new ClientSingleRoundState(this.appServer);
    }

    public activate(event:StartRoundEvent) {
        switch (event.mode) {
            case RoundMode.SingleRound:
            case RoundMode.SingleRoundTriple:
                this.app.fillSlot(this.singleRoundState);
                this.app.fillSlot(this.singleResultScreenState);
                this.app.fillSlot(this.immediatelyQuitState);

                event.slot = Protocol.Round; // Подменяем получателя события
                this.app.proceedEvent(event);
                break;

            case RoundMode.ServeSingleRound:
                this.app.fillSlot(this.clientSingleRound);
                this.app.fillSlot(this.singleResultScreenState);
                this.app.fillSlot(this.immediatelyQuitState);

                event.slot = Protocol.ConfirmStartServerRound; // Подменяем получателя события
                this.appServer.proceedEvent(event);
                break;
        }
    }

    public exit() {
        this.app.clearSlot(Protocol.Round);
        this.app.clearSlot(Protocol.RoundResult);
        this.app.clearSlot(Protocol.RoundQuit);

        this.app.clearSlot(Protocol.RoundSetThrowedDice);
        this.app.clearSlot(Protocol.RoundHoldDie);
        this.app.clearSlot(Protocol.RoundFreeDie);
        this.app.clearSlot(Protocol.RoundSelectCard);
        this.app.clearSlot(Protocol.RoundFillCell);
    }
}
