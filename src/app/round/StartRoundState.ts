import {AppEvent, ClientSideAppState, IAppState, IRemoteApplication} from "../Application";
import {Slot} from "../Protocol";
import {SingleRoundState} from "./SingleRoundState";
import {QuitRoundState} from "./QuitRoundState";
import {ClientSingleRoundState} from "./remote/ClientSingleRoundState";
import {RoundMode} from "./RoundMode";
import {SingleResultScreenState} from "../resultScreen/SingleResultScreenState";

export interface IStartRoundEventParams {
    mode:RoundMode;
    withJokers?:boolean;
}

export class StartRoundEvent extends AppEvent implements IStartRoundEventParams {
    public mode:RoundMode;
    public withJokers:boolean = false;

    constructor(params:IStartRoundEventParams) {
        super(Slot.StartRound);
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
        super(Slot.StartRound, appServer);

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

                event.slot = Slot.Round; // Подменяем получателя события
                this.app.proceedEvent(event);
                break;

            case RoundMode.ServeSingleRound:
                this.app.fillSlot(this.clientSingleRound);
                this.app.fillSlot(this.singleResultScreenState);
                this.app.fillSlot(this.immediatelyQuitState);

                event.slot = Slot.ConfirmStartServerRound; // Подменяем получателя события
                this.appServer.proceedEvent(event);
                break;
        }
    }

    public exit() {
        this.app.clearSlot(Slot.Round);
        this.app.clearSlot(Slot.RoundResult);
        this.app.clearSlot(Slot.RoundQuit);

        this.app.clearSlot(Slot.RoundSetThrowedDice);
        this.app.clearSlot(Slot.RoundHoldDie);
        this.app.clearSlot(Slot.RoundFreeDie);
        this.app.clearSlot(Slot.RoundSelectCard);
        this.app.clearSlot(Slot.RoundFillCell);
    }
}
