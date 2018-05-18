import {AppState, ClientApplication} from "../Application";
import {SingleResultScreenController} from "./SingleResultScreenController";
import {FinishRoundEvent} from "../round/SingleRoundState";
import {Protocol} from "../Protocol";

export class SingleResultScreenState extends AppState {
    private controller:SingleResultScreenController;

    constructor() {
        super(Protocol.RoundResult);
    }

    public activate(event:FinishRoundEvent) {
        this.controller = new SingleResultScreenController(this, (this.app as ClientApplication).viewFactory.createRoundResultView());
        this.controller.activate(event.model);
    }

    public sleep() {
        this.controller.sleep();
    }

    public closeScreen() {
        this.app.toState(Protocol.StartApplication);
    }
}