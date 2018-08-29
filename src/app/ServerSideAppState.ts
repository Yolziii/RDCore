import {IRemoteApplication} from "./IRemoteApplication";
import {AppState} from "./AppState";
import {StateSlot} from "./StateSlot";

/** Состояние сервера, которое должно взаимодействовать с клиентом */
export class ServerSideAppState extends AppState {
    protected appClient:IRemoteApplication;

    constructor(slot:StateSlot, appClient:IRemoteApplication) {
        super(slot);
        this.appClient = appClient;
    }
}
