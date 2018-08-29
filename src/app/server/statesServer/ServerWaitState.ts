/** Сстояние, в котором клиентское зеркало ждет событий от клиента */
import {AppState} from "../../AppState";
import {StateSlot} from "../../StateSlot";
import {ClientMirrorApplication} from "../ClientMirrorApplication";

export class ServerWaitState extends AppState {
    constructor() {
        super(StateSlot.WaitForClient);
    }

    public activate() {
        const id = (this.app as ClientMirrorApplication).connection.id;
    }
}
