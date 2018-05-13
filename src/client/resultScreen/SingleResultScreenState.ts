import {AppState} from "../../application/Application";
import {SingleResultScreenController} from "./SingleResultScreenController";
import {FinishRoundEvent} from "../round/SingleRoundState";
import {Protocol} from "../Protocol";

export class SingleResultScreenState extends AppState {
    private controller:SingleResultScreenController;

    public activate(event:FinishRoundEvent) {
        this.controller = new SingleResultScreenController(this, this.app.viewFactory.createRoundResultView());
        this.controller.activate(event.model);
    }

    public sleep() {
        this.controller.sleep();
    }

    public closeScreen() {
        this.app.toState(Protocol.StartApplication);
    }
}
