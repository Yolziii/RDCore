import {AppState, ClientApplication} from "../Application";
import {SingleResultScreenController} from "./SingleResultScreenController";
import {FinishRoundEvent} from "../round/SingleRoundState";
import {Slot} from "../Protocol";

export class SingleResultScreenState extends AppState {
    private controller:SingleResultScreenController;

    constructor() {
        super(Slot.RoundResult);
    }

    public activate(event:FinishRoundEvent) {
        this.controller = new SingleResultScreenController(this, (this.app as ClientApplication).viewFactory.createRoundResultView());
        this.controller.activate(event.model);
    }

    public sleep() {
        this.controller.sleep();
    }

    public closeScreen() {
        this.app.toState(Slot.StartingClient);
    }
}
