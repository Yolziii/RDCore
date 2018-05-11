import {AppState} from "../../application/Application";
import {SingleResultScreenController} from "./SingleResultScreenController";
import {FinishRoundEvent} from "../round/SingleRoundState";

export class SingleResultScreenState extends AppState {
    private controller:SingleResultScreenController;

    public activate(event:FinishRoundEvent) {
        //this.controller = new SingleResultScreenController(this, this.app.viewFactory.createRoundResultView());
        //controller.activate(event.model);
    }

    public close() {

    }
}
