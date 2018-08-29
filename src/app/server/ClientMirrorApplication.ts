import {Application} from "../Application";
import {Logger} from "../../util/logger/Logger";
import {StateSlot} from "../StateSlot";
import {ClientConnection} from "./ClientConnection";

/** Зеркало клиента на строне сервера */
export class ClientMirrorApplication extends Application {
    private _connection:ClientConnection;

    public linkConnection(connection:ClientConnection) {
        this._connection = connection;
    }

    public get connection():ClientConnection {
        return this._connection;
    }

    protected logStateMethod(method:string, slot:StateSlot) {
        Logger.info("(" + this.connection.id + ") <" +method + "> for: " + StateSlot[slot]);
    }
}
