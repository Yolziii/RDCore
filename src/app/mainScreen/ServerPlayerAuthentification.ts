import {AppEvent, ClientSideAppState, IRemoteApplication, ServerSideAppState} from "../Application";
import {Slot} from "../Protocol";
import {ClientConnection} from "../../server/ClientConnection";

export interface IPlayer {
    name: string;
}

export class AppEventPlayerAuthentication extends AppEvent {
    public player:IPlayer;

    constructor(player:IPlayer) {
        super(Slot.PlayerAuthentication);
        this.player = player;
    }
}

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

export class ClientPlayerAuthentication extends ClientSideAppState {
    private player: IPlayer;

    constructor(player: IPlayer, appServer:IRemoteApplication) {
        super(Slot.PlayerAuthentication, appServer);
        this.player = player;
    }

    public activate() {
        const event = new AppEventPlayerAuthentication(this.player);
        this.appServer.proceedEvent(event);
    }
}
