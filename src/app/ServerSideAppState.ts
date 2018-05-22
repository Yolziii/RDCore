import {IRemoteApplication} from "./IRemoteApplication";
import {AppState} from "./AppState";
import {Slot} from "./Slot";

/** Состояние сервера, которое должно взаимодействовать с клиентом */
export class ServerSideAppState extends AppState {
    protected appClient:IRemoteApplication;

    constructor(slot:Slot, appClient:IRemoteApplication) {
        super(slot);
        this.appClient = appClient;
    }
}
