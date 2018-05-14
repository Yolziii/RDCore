import {AppEvent, AppState, ClientApplication, IAppEvent} from "../../application/Application";
import {MainScreenController} from "./MainScreenController";
import {Protocol} from "../Protocol";

export class SingleRoundEvent extends AppEvent {
    private _withJokers:boolean = false;

    public get withJokers() {
        return this._withJokers;
    }

    constructor(withJokers:boolean) {
        super(Protocol.StartRound);
        this._withJokers = withJokers;
    }
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
        this.app.toState(Protocol.StartRound);
    }

    public toSingleJokerRound() {
        const event:SingleRoundEvent = new SingleRoundEvent(true);
        this.app.onEvent(event);
    }
}
