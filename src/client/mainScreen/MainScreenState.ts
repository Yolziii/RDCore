import {AppEvent, AppState, ClientApplication, IAppEvent} from "../../application/Application";
import {MainScreenController} from "./MainScreenController";
import {Protocol} from "../Protocol";
import {StartRoundEvent} from "../round/StartRoundState";

export enum RoundMode {
    SingleRound,
    SingleRoundTriple
}

export class MainScreenState extends AppState {
    private controller:MainScreenController;

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
        this.app.onEvent(event);
    }

    public toSingleJokerRound() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.SingleRound, withJokers: true});
        this.app.onEvent(event);
    }

    public toSingleTripleRound() {
        const event:StartRoundEvent = new StartRoundEvent({mode: RoundMode.SingleRoundTriple});
        this.app.onEvent(event);
    }
}
