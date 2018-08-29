import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {ClientSideAppState} from "../../../ClientSideAppState";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {StateSlot} from "../../../StateSlot";

/** Выбарет указанного игрока по указанию сервера */
export class ClientRoundSelectPlayerState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(StateSlot.RoundSelectPlayer, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.selectPlayer(event.index);
        this.app.exitToPreviousState();
    }
}
