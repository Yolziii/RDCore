import {IRemoteApplication} from "./IRemoteApplication";
import {AppState} from "./AppState";
import {Slot} from "./Slot";

/** Состояние клиента, которое должно взаимодействовать с сервером */
export class ClientSideAppState extends AppState {
    protected appServer:IRemoteApplication;

    constructor(slot:Slot, appServer:IRemoteApplication) {
        super(slot);
        this.appServer = appServer;
    }
}
