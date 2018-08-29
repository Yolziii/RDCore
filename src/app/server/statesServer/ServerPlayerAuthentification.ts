import {StateSlot} from "../../StateSlot";
import {ClientConnection} from "../ClientConnection";
import {AppEventPlayerAuthentication} from "../../events/AppEventPlayerAuthentication";
import {ServerSideAppState} from "../../ServerSideAppState";

export class ServerPlayerAuthentification extends ServerSideAppState {
    private connection:ClientConnection;

    constructor(connection:ClientConnection) {
        super(StateSlot.PlayerAuthentication, connection);
        this.connection = connection;
    }

    public activate(event:AppEventPlayerAuthentication) {
        this.connection.linkClientId(event.player.name);

        this.appClient.toState(StateSlot.MainScreen);
        this.app.exitToPreviousState();
    }
}
