import {MainScreenController} from "../controllers/MainScreenController";
import {RoundMode} from "../controllers/round/RoundMode";
import {ClientApplication} from "../ClientApplication";
import {StartRoundEvent} from "../../events/round/StartRoundEvent";
import {AppState} from "../../AppState";
import {Slot} from "../../Slot";

export class MainScreenState extends AppState {
    private controller:MainScreenController;

    constructor() {
        super(Slot.MainScreen);
    }

    public init() {
        this.controller = new MainScreenController(this, (this.app as ClientApplication).viewFactory.createMainScreenView());
        this.controller.activate();
    }

    public wakeup() {
        this.controller.wakeUp();
    }

    public sleep() {
        this.controller.sleep();
    }

    public toSinglePlayer() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.SingleRound});
        this.app.proceedEvent(event);
    }

    public toSingleJokerRound() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.SingleRound, withJokers: true});
        this.app.proceedEvent(event);
    }

    public toSingleTripleRound() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.SingleRoundTriple});
        this.app.proceedEvent(event);
    }

    public toServerSingleMode() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.ServeSingleRound});
        this.app.proceedEvent(event);
    }
}
