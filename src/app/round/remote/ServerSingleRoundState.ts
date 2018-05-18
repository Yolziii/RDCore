import {AppState} from "../../Application";
import {Protocol} from "../../Protocol";

export class ServerSingleRoundState extends AppState {
    public activate() {

    }

    public exit() {
        this.app.clearSlot(Protocol.RoundSetThrowedDice);
        this.app.clearSlot(Protocol.RoundHoldDie);
        this.app.clearSlot();
    }
}
