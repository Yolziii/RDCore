import {SingleRoundState} from "./SingleRoundState";
import {QuitRoundState} from "./QuitRoundState";
import {ClientSingleRoundState} from "./ClientSingleRoundState";
import {RoundMode} from "../../controllers/round/RoundMode";
import {SingleResultScreenState} from "../../controllers/resultScreen/SingleResultScreenState";
import {StartRoundEvent} from "../../../events/round/StartRoundEvent";
import {IAppState} from "../../../IAppState";
import {ClientSideAppState} from "../../../ClientSideAppState";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {StateSlot} from "../../../StateSlot";

export class StartRoundState extends ClientSideAppState implements IAppState {
    private singleRoundState: SingleRoundState;
    private singleResultScreenState: SingleResultScreenState;
    private immediatelyQuitState:QuitRoundState;

    private clientSingleRound: ClientSingleRoundState;

    constructor(appServer:IRemoteApplication) {
        super(StateSlot.StartRound, appServer);

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

                event.slot = StateSlot.Round; // Подменяем получателя события
                this.app.proceedEvent(event);
                break;

            case RoundMode.ServeSingleRound:
                this.app.fillSlot(this.clientSingleRound);
                this.app.fillSlot(this.singleResultScreenState);
                this.app.fillSlot(this.immediatelyQuitState);

                event.slot = StateSlot.ConfirmStartServerRound; // Подменяем получателя события
                this.appServer.proceedEvent(event);
                break;
        }
    }

    public exit() {
        this.app.clearSlot(StateSlot.Round);
        this.app.clearSlot(StateSlot.RoundResult);
        this.app.clearSlot(StateSlot.RoundQuit);

        this.app.clearSlot(StateSlot.RoundSetThrowedDice);
        this.app.clearSlot(StateSlot.RoundHoldDie);
        this.app.clearSlot(StateSlot.RoundFreeDie);
        this.app.clearSlot(StateSlot.RoundSelectCard);
        this.app.clearSlot(StateSlot.RoundFillCell);
    }
}
