import {AppState, ClientMirrorApplication} from "../Application";
import {Slot} from "../Protocol";
import {Logger} from "../../util/Logger";

/** Сстояние, в котором клиентское зеркало ждет событий от клиента */
export class ServerWaitState extends AppState {
    constructor() {
        super(Slot.WaitForClient);
    }

    public activate() {
        const id = (this.app as ClientMirrorApplication).connection.id;
    }
}
