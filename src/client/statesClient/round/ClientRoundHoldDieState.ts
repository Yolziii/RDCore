import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Сохраняет кость с указанным индексом по запросу сервера */
export class ClientRoundHoldDieState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication) {
        super(Slot.RoundHoldDie, appServer);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canHoldDie(event.index)) {
            this.model.holdDie(event.index);
            this.app.exitToPreviousState();
        } else {
            // TODO: Исключение + запрашивать у сервера полное обновление состояния
        }
    }
}
