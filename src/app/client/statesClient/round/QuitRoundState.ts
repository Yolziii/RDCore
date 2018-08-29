import {AppState} from "../../../AppState";
import {StateSlot} from "../../../StateSlot";

export class QuitRoundState extends AppState {
    constructor() {
        super(StateSlot.RoundQuit);
    }

    public activate() {
        this.app.toState(StateSlot.MainScreen);
    }
}
