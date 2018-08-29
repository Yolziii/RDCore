import {ServerSideAppState} from "../../../ServerSideAppState";
import {StateSlot} from "../../../StateSlot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../IRemoteApplication";
import {IRoundObserver} from "../../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../../model/coreGameplay/round/RoundEventType";

/** По просьбе клиента выбирает указанную карточку игрока и сообщает об этой клиенту после того, как она выбрана */
export class ServerRoundSelectCardState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(StateSlot.RoundSelectCard, appClient);
    }

    public linkModel(model:IRound) {
        this.model = model;
    }

    public activate(event:RoundIndexAppEvent) {
        this.model.addObserver(this);
        this.model.selectCard(event.index);
    }

    public onRoundEvent(event:RoundEventIndex) {
        if (event.type === RoundEventType.SelectCard) {
            this.model.removeObserver(this);

            const appEvent = new RoundIndexAppEvent(StateSlot.RoundSelectCard, event.index);
            this.appClient.proceedEvent(appEvent);

            this.app.exitToPreviousState();
        }
    }
}
