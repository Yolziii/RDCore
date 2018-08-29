import {ClientSideAppState} from "../../ClientSideAppState";
import {IPlayer} from "../../IPlayer";
import {IRemoteApplication} from "../../IRemoteApplication";
import {StateSlot} from "../../StateSlot";
import {AppEventPlayerAuthentication} from "../../events/AppEventPlayerAuthentication";

export class ClientPlayerAuthenticationState extends ClientSideAppState {
    private player: IPlayer;

    constructor(player: IPlayer, appServer:IRemoteApplication) {
        super(StateSlot.PlayerAuthentication, appServer);
        this.player = player;
    }

    public activate() {
        const event = new AppEventPlayerAuthentication(this.player);
        this.appServer.proceedEvent(event);
        this.app.toState(StateSlot.MainScreen);
    }
}
