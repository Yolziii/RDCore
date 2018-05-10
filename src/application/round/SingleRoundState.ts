import {AppState} from "../Application";
import {RoundController} from "./RoundController";
import {RoundPlayerCard1, SingleRound} from "../../core/Rounds";

export class SingleRoundState extends AppState {
    private controller:RoundController;

    public activate() {
        const player = new RoundPlayerCard1();
        const model = new SingleRound(player);

        this.controller.activate(model);
    }

    protected init() {
        this.controller = new RoundController(this.app, this.app.viewFactory.createRoundView());
    }
}
