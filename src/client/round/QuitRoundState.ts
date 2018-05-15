import {AppState, IAppState} from "../../application/Application";
import {Protocol} from "../Protocol";

export class QuitRoundState extends AppState implements IAppState {
    public get doesPutActiveToSleep() {
        return false;
    }

    public activate() {
        this.app.toState(Protocol.StartApplication);
    }
}
