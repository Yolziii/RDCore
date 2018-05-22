import {Slot} from "../../app/Slot";
import {ClientConnection} from "../ClientConnection";
import {AppEventPlayerAuthentication} from "../../events/AppEventPlayerAuthentication";
import {ServerSideAppState} from "../../app/ServerSideAppState";

export class ServerPlayerAuthentification extends ServerSideAppState {
    private connection:ClientConnection;

    constructor(connection:ClientConnection) {
        super(Slot.PlayerAuthentication, connection);
        this.connection = connection;
    }

    public activate(event:AppEventPlayerAuthentication) {
        this.connection.linkClientId(event.player.name);

        this.appClient.toState(Slot.MainScreen);
        this.app.exitToPreviousState();
    }
}
