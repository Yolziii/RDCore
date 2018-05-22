import {ServerSideAppState} from "../../../app/ServerSideAppState";
import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {IRoundObserver} from "../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../model/coreGameplay/round/RoundEventType";

/** Обрабатывает запрос от клиента на сохранение кости */
export class ServerRoundHoldDieState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(Slot.RoundHoldDie, appClient);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        if (this.model.canHoldDie(event.index)) {
            this.model.addObserver(this);
            this.model.holdDie(event.index);
        } else {
            // TODO: Исключение + полностью обновлять состояние клиента
        }
    }

    public  onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.Hold) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(Slot.RoundHoldDie, event.index);
            this.appClient.proceedEvent(appEvent);
            this.app.exitToPreviousState();
        }
    }
}
