import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {ClientSideAppState} from "../../../ClientSideAppState";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {StateSlot} from "../../../StateSlot";

/** Сохраняет кость с указанным индексом по запросу сервера */
export class ClientRoundHoldDieState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication) {
        super(StateSlot.RoundHoldDie, appServer);
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
