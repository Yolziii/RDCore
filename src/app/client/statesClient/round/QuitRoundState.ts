import {AppState} from "../../../AppState";
import {Slot} from "../../../Slot";

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
