import {SingleResultScreenController} from "./SingleResultScreenController";
import {ClientApplication} from "../../ClientApplication";
import {FinishRoundEvent} from "../../../events/round/FinishRoundEvent";
import {AppState} from "../../../AppState";
import {Slot} from "../../../Slot";

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
