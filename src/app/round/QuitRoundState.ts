import {AppState, IAppState} from "../Application";
import {Slot} from "../Protocol";

export class QuitRoundState extends AppState implements IAppState {
    constructor() {
        super(Slot.RoundQuit);
    }

    public get doesPutActiveToSleep() {
        return false;
    }

    public activate() {
        this.app.toState(Slot.StartingClient);
    }
}
