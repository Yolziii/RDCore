import {AppState, ClientApplication} from "../Application";
import {MainScreenController} from "./MainScreenController";
import {Slot} from "../Protocol";
import {StartRoundEvent} from "../round/StartRoundState";
import {RoundMode} from "../round/RoundMode";

export class MainScreenState extends AppState {
    private controller:MainScreenController;

    constructor() {
        super(Slot.StartingClient);
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
