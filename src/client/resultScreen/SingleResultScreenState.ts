import {AppState, ClientApplication} from "../../application/Application";
import {SingleResultScreenController} from "./SingleResultScreenController";
import {FinishRoundEvent} from "../round/SingleRoundState";
import {Protocol} from "../Protocol";

export class SingleResultScreenState extends AppState {
    private controller:SingleResultScreenController;

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
