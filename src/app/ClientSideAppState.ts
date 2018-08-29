import {IRemoteApplication} from "./IRemoteApplication";
import {AppState} from "./AppState";
import {StateSlot} from "./StateSlot";

/** Состояние клиента, которое должно взаимодействовать с сервером */
export class ClientSideAppState extends AppState {
    protected appServer:IRemoteApplication;

    constructor(slot:StateSlot, appServer:IRemoteApplication) {
        super(slot);
        this.appServer = appServer;
    }
}
