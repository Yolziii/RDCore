import {ServerSideAppState} from "../../../app/ServerSideAppState";
import {Slot} from "../../../app/Slot";
import {RoundIndexAppEvent} from "../../../events/round/RoundIndexAppEvent";
import {IRemoteApplication} from "../../../app/IRemoteApplication";
import {IRoundObserver} from "../../../model/coreGameplay/round/IRoundObserver";
import {IRound} from "../../../model/coreGameplay/round/IRound";
import {RoundEventIndex} from "../../../model/coreGameplay/round/events/RoundEventIndex";
import {RoundEventType} from "../../../model/coreGameplay/round/RoundEventType";

/** По просьбе клиента выбирает указанную карточку игрока и сообщает об этой клиенту после того, как она выбрана */
export class ServerRoundSelectCardState extends ServerSideAppState implements IRoundObserver {
    private model:IRound;

    constructor(appClient:IRemoteApplication) {
        super(Slot.RoundSelectCard, appClient);
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

            const appEvent = new RoundIndexAppEvent(Slot.RoundSelectCard, event.index);
            this.appClient.proceedEvent(appEvent);

            this.app.exitToPreviousState();
        }
    }
}
