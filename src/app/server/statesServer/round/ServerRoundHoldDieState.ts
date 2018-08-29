import {ServerSideAppState} from "../../../ServerSideAppState";
import {StateSlot} from "../../../StateSlot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/** Обрабатывает запрос от клиента на сохранение кости */
export class ServerRoundHoldDieState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(StateSlot.RoundHoldDie, appClient);
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

            const appEvent = new RoundIndexAppEvent(StateSlot.RoundHoldDie, event.index);
            this.appClient.proceedEvent(appEvent);
            this.app.exitToPreviousState();
        }
    }
}
