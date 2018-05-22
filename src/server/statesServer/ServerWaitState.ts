/** Сстояние, в котором клиентское зеркало ждет событий от клиента */
import {AppState} from "../../app/AppState";
import {Slot} from "../../app/Slot";
import {ClientMirrorApplication} from "../ClientMirrorApplication";

export class ServerWaitState extends AppState {
    constructor() {
        super(Slot.WaitForClient);
    }

    public activate() {
        const id = (this.app as ClientMirrorApplication).connection.id;
    }
}
