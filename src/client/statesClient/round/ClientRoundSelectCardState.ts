import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Выбарет указанную карточку по указанию сервера */
export class ClientRoundSelectCardState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication) {
        super(Slot.RoundSelectCard, appServer);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.selectCard(event.index);
        this.app.exitToPreviousState();
    }
}
