import {AppState, IAppState} from "../Application";
import {Protocol} from "../Protocol";

export class QuitRoundState extends AppState implements IAppState {
    public get doesPutActiveToSleep() {
        return false;
    }

    public activate() {
        this.app.toState(Protocol.StartApplication);
    }
}
