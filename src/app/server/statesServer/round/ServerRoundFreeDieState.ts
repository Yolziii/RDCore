import {ServerSideAppState} from "../../../ServerSideAppState";
import {Slot} from "../../../Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/** Обрабатывает запрос от клиента на освобождение кости */
export class ServerRoundFreeDieState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(Slot.RoundFreeDie, appClient);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canFreeDie(event.index)) {
            this.model.addObserver(this);
            this.model.freeDie(event.index);
        } else {
            // TODO: Исключение + полностью обновлять состояние клиента
        }
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.Free) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Slot.RoundFreeDie, event.index);
            this.appClient.proceedEvent(appEvent);
            this.app.exitToPreviousState();
        }
    }
}
