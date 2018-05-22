import {Slot} from "../../../app/Slot";
import {AppState} from "../../../app/AppState";

export class QuitRoundState extends AppState {
    constructor() {
        super(Slot.RoundQuit);
    }

    public get doesPutActiveToSleep() {
        return false;
    }

    public activate() {
        this.app.toState(Slot.MainScreen);
    }
}
