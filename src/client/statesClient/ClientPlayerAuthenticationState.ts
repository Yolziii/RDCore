import {AppEventPlayerAuthentication} from "../../events/AppEventPlayerAuthentication";
import {ClientSideAppState} from "../../app/ClientSideAppState";
import {IPlayer} from "../../app/IPlayer";
import {IRemoteApplication} from "../../app/IRemoteApplication";
import {Slot} from "../../app/Slot";

export class ClientPlayerAuthenticationState extends ClientSideAppState {
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
