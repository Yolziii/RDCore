import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {ClientSideAppState} from "../../../app/ClientSideAppState";
import {IRound} from "../../../model/coreGameplay/round/IRound";

/** Освобождает кость с указанным индексом по запросу сервера */
export class ClientRoundFreeDieState extends ClientSideAppState {
    private model:IRound;

    constructor(appServer:IRemoteApplication) {
        super(Slot.RoundFreeDie, appServer);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canFreeDie(event.index)) {
            this.model.freeDie(event.index);
            this.app.exitToPreviousState();
        } else {
            // TODO: Исключение + запрашивать у сервера полное обновление состояния
        }
    }
}
