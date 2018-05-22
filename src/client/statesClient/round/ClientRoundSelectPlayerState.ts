import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Выбарет указанного игрока по указанию сервера */
export class ClientRoundSelectPlayerState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication, model:IRound) {
        super(Slot.RoundSelectPlayer, appServer);
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.selectPlayer(event.index);
        this.app.exitToPreviousState();
    }
}
