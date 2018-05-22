import {Slot} from "../../../app/Slot";
import {SingleRoundState} from "./SingleRoundState";
import {QuitRoundState} from "./QuitRoundState";
import {ClientSingleRoundState} from "./ClientSingleRoundState";
import {RoundMode} from "../../controllers/round/RoundMode";
import {SingleResultScreenState} from "../../controllers/resultScreen/SingleResultScreenState";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {IAppState} from "../../../app/IAppState";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {StartRoundEvent} from "../../../events/round/StartRoundEvent";

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
